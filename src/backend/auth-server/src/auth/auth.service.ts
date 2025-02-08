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
    if (!payload.device || !(payload.device in DeviceType)) {
      throw new UnauthorizedException("유효하지 않은 디바이스 타입입니다.");
    }

    await this.redis.del(REDIS_KEY.REFRESH_TOKEN(payload.id, payload.device));
    await this.redis.del(REDIS_KEY.ACCESS_TOKEN(payload.id, payload.device));

    return { message: "로그아웃 되었습니다." };
  }

  async updateTokens(rawToken: string) {
    const payload = await this.parseBearerToken(rawToken, true);

    const payloadStr = await this.redis.get(
      REDIS_KEY.REFRESH_TOKEN(payload.id, payload.device as DeviceType),
    );

    if (!payloadStr) {
      throw new UnauthorizedException("만료된 토큰입니다.");
    }

    const device = payload.device as DeviceType;

    if (device !== DeviceType.WEB && device !== DeviceType.MOBILE) {
      throw new UnauthorizedException("유효하지 않은 토큰입니다.");
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
          300, // 5분
        );

        await this.redis.set(
          REDIS_KEY.REFRESH_TOKEN(payload.id, device),
          refreshToken,
          "EX",
          3600, // 1시간
        );
      } catch {
        throw new BadRequestException(
          "Redis에 토큰을 저장하는데 실패했습니다.",
        );
      }
    }

    return {
      refreshToken: refreshToken,
      accessToken: accessToken,
    };
  }

  divideRawToken(rawToken: string, type: "basic" | "bearer") {
    const basicSplit = rawToken.split(" ");
    if (basicSplit.length !== 2) {
      throw new BadRequestException("토큰 포맷이 잘못됐습니다.");
    }

    const [_type, token] = basicSplit;
    if (_type.toLowerCase() !== type) {
      throw new BadRequestException("토큰 포맷이 잘못됐습니다.");
    }

    return token;
  }

  parseBasicToken(rawToken: string) {
    const token = this.divideRawToken(rawToken, "basic");

    const decoded = Buffer.from(token, "base64").toString("utf-8");

    const tokenSplit = decoded.split(":");
    if (tokenSplit.length !== 2) {
      throw new BadRequestException("토큰 포맷이 잘못됐습니다.");
    }

    const [email, password] = tokenSplit;

    return { email, password };
  }

  async parseBearerToken(rawToken: string, isRefreshToken: boolean) {
    const token = this.divideRawToken(rawToken, "bearer");

    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.configService.getOrThrow<string>(
          isRefreshToken ? "REFRESH_TOKEN_SECRET" : "ACCESS_TOKEN_SECRET",
        ),
      });

      if (isRefreshToken) {
        if (payload.type !== "refresh") {
          throw new BadRequestException("Refresh 토큰을 입력해주세요.");
        }
      } else {
        if (payload.type !== "access") {
          throw new BadRequestException("Access 토큰을 입력해주세요.");
        }
      }

      return payload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new BadRequestException("만료된 토큰입니다.");
      }
      throw new BadRequestException("토큰 포맷이 잘못됐습니다.");
    }
  }

  async authenticate(email: string, password: string) {
    const user = await this.getUserWithPasswordByEmail(email);
    if (!user) {
      throw new BadRequestException("잘못된 로그인 정보입니다.");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException("잘못된 로그인 정보입니다.");
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
      isRefreshToken ? "REFRESH_TOKEN_SECRET" : "ACCESS_TOKEN_SECRET",
    );

    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      device: device,
      type: isRefreshToken ? "refresh" : "access",
      exp: Math.floor(Date.now() / 1000) + (isRefreshToken ? 3600 : 300), // refresh: 1시간, access: 5분
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
    const token = this.divideRawToken(rawToken, "bearer");
    const payload = await this.parseBearerToken(rawToken, false);
    const storedToken = await this.redis.get(
      REDIS_KEY.ACCESS_TOKEN(payload.id, payload.device as DeviceType),
    );

    if (!storedToken) {
      throw new UnauthorizedException("만료된 토큰입니다.");
    }

    if (storedToken !== token) {
      throw new UnauthorizedException("유효하지 않은 토큰입니다.");
    }

    return {
      message: "토큰이 유효합니다.",
      userId: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
