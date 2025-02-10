import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { ConfigService } from "@nestjs/config";
import { TokenPayload } from "./interface/token-payload.interface";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { UserLoginDto } from "./dto/user-login.dto";
import { RedisService } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { DeviceType } from "./enum/device-type.enum";
import { REDIS_KEY } from "./constants/redis-key.constant";
import {
  MESSAGES,
  TOKEN_TYPE,
  TOKEN_EXPIRATION_TIME,
  RAW_TOKEN_TYPE,
} from "./constants/constants";
import { ENV_KEY } from "./constants/env-key.constant";

@Injectable()
export class AuthService {
  private readonly redis: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    @Inject("USER_SERVICE")
    private readonly userService: ClientProxy,
  ) {
    this.redis = this.redisService.getOrThrow();
  }

  async login(rawToken: string, device: DeviceType) {
    const { email, password } = this.parseBasicToken(rawToken);

    const payload = await this.authenticate(email, password);

    return await this.sendTokens(payload, device);
  }

  async logout(rawToken: string) {
    const payload = await this.parseBearerToken(rawToken, false);
    console.log("payload:", payload);
    if (
      !payload.device ||
      (payload.device !== DeviceType.WEB &&
        payload.device !== DeviceType.MOBILE)
    ) {
      throw new UnauthorizedException(MESSAGES.INVALID_DEVICE);
    }

    await this.redis.del(REDIS_KEY.REFRESH_TOKEN(payload.id, payload.device));
    await this.redis.del(REDIS_KEY.ACCESS_TOKEN(payload.id, payload.device));

    return { message: MESSAGES.LOGOUT_SUCCESS };
  }

  async updateTokens(rawToken: string) {
    const payload = await this.parseBearerToken(rawToken, true);

    const device = payload.device as DeviceType;

    if (device !== DeviceType.WEB && device !== DeviceType.MOBILE) {
      throw new UnauthorizedException(MESSAGES.INVALID_DEVICE);
    }

    const token = await this.redis.get(
      REDIS_KEY.REFRESH_TOKEN(payload.id, device),
    );

    if (!token) {
      throw new UnauthorizedException(MESSAGES.INVALID_TOKEN);
    }

    return await this.sendTokens(payload, device);
  }

  async sendTokens(payload: TokenPayload, device: DeviceType) {
    const refreshToken = await this.issueToken(payload, device, true);
    const accessToken = await this.issueToken(payload, device, false);

    if (this.redis) {
      try {
        await this.redis.set(
          REDIS_KEY.ACCESS_TOKEN(payload.id, device),
          accessToken,
          "EX",
          TOKEN_EXPIRATION_TIME.ACCESS,
        );

        await this.redis.set(
          REDIS_KEY.REFRESH_TOKEN(payload.id, device),
          refreshToken,
          "EX",
          TOKEN_EXPIRATION_TIME.REFRESH,
        );
      } catch {
        throw new BadRequestException(MESSAGES.REDIS_ERROR);
      }
    }

    return {
      refreshToken: refreshToken,
      accessToken: accessToken,
    };
  }

  divideRawToken(
    rawToken: string,
    type: typeof RAW_TOKEN_TYPE.BASIC | typeof RAW_TOKEN_TYPE.BEARER,
  ) {
    const basicSplit = rawToken.split(" ");
    if (basicSplit.length !== 2) {
      throw new BadRequestException(MESSAGES.INVALID_TOKEN_FORMAT);
    }

    const [_type, token] = basicSplit;
    if (_type !== type) {
      throw new BadRequestException(MESSAGES.INVALID_TOKEN_FORMAT);
    }

    return token;
  }

  parseBasicToken(rawToken: string) {
    const token = this.divideRawToken(rawToken, RAW_TOKEN_TYPE.BASIC);

    const decoded = Buffer.from(token, "base64").toString("utf-8");

    const tokenSplit = decoded.split(":");
    if (tokenSplit.length !== 2) {
      throw new BadRequestException(MESSAGES.INVALID_TOKEN_FORMAT);
    }

    const [email, password] = tokenSplit;

    return { email, password };
  }

  async parseBearerToken(rawToken: string, isRefreshToken: boolean) {
    const token = this.divideRawToken(rawToken, RAW_TOKEN_TYPE.BEARER);

    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.configService.getOrThrow<string>(
          isRefreshToken
            ? ENV_KEY.REFRESH_TOKEN_SECRET
            : ENV_KEY.ACCESS_TOKEN_SECRET,
        ),
      });

      if (isRefreshToken) {
        if (payload.type !== TOKEN_TYPE.REFRESH) {
          throw new BadRequestException(MESSAGES.INVALID_TOKEN_TYPE);
        }
      } else {
        if (payload.type !== TOKEN_TYPE.ACCESS) {
          throw new BadRequestException(MESSAGES.INVALID_TOKEN_TYPE);
        }
      }

      return payload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new BadRequestException(MESSAGES.EXPIRED_TOKEN);
      }
      throw new BadRequestException(MESSAGES.INVALID_TOKEN_FORMAT);
    }
  }

  async authenticate(email: string, password: string) {
    const user = await this.getUserWithPasswordByEmail(email);
    if (!user) {
      throw new BadRequestException(MESSAGES.INVALID_LOGIN_INFO);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException(MESSAGES.INVALID_LOGIN_INFO);
    }

    const { password: _, ...withoutPassword } = user;

    return withoutPassword;
  }

  async getUserByEmail(email: string) {
    return await lastValueFrom<UserLoginDto>(
      this.userService.send({ cmd: "get_user_by_email" }, { email }),
    );
  }

  async getUserWithPasswordByEmail(email: string) {
    return await lastValueFrom<UserLoginDto>(
      this.userService.send(
        { cmd: "get_user_with_password_by_email" },
        { email },
      ),
    );
  }

  async issueToken(
    user: TokenPayload,
    device: DeviceType,
    isRefreshToken: boolean,
  ) {
    const secret = this.configService.getOrThrow<string>(
      isRefreshToken
        ? ENV_KEY.REFRESH_TOKEN_SECRET
        : ENV_KEY.ACCESS_TOKEN_SECRET,
    );

    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      device: device,
      type: isRefreshToken ? TOKEN_TYPE.REFRESH : TOKEN_TYPE.ACCESS,
      exp:
        Math.floor(Date.now() / 1000) +
        (isRefreshToken
          ? TOKEN_EXPIRATION_TIME.REFRESH
          : TOKEN_EXPIRATION_TIME.ACCESS),
    };

    const options = {
      secret: secret,
      header: {
        typ: "JWT",
        alg: "HS256",
        kid: "kicktube-jwt", // Kong에 설정한 key와 일치
      },
    };

    return this.jwtService.signAsync(payload, options);
  }

  async validateStoredToken(rawToken: string) {
    const token = this.divideRawToken(rawToken, RAW_TOKEN_TYPE.BEARER);
    const payload = await this.parseBearerToken(rawToken, false);
    const storedToken = await this.redis.get(
      REDIS_KEY.ACCESS_TOKEN(payload.id, payload.device as DeviceType),
    );

    if (!storedToken) {
      throw new UnauthorizedException(MESSAGES.INVALID_TOKEN);
    }

    if (storedToken !== token) {
      throw new UnauthorizedException(MESSAGES.INVALID_TOKEN);
    }

    return {
      message: MESSAGES.VALID_TOKEN,
      userId: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
