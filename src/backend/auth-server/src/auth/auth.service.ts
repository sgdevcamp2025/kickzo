import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { ConfigService } from "@nestjs/config";
import { TokenPayload } from "./interface/token-payload.interface";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { UserLoginDto } from "./dto/user-login.dto";
import { RedisService } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { DeviceType } from "./enum/device-type.enum";

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

    const user = await this.authenticate(email, password);

    return await this.sendTokens(user, device);
  }

  async logout(rawToken: string) {
    const token = this.divideRawToken(rawToken, "bearer");

    const payload = await this.parseBearerToken(rawToken, false);

    await this.redis.del(`refresh_token:${payload.id}:${payload.device}`);
    await this.redis.del(`access_token:${token}`);

    return { message: "로그아웃 되었습니다." };
  }

  async sendTokens(user: TokenPayload, device: DeviceType) {
    const refreshToken = await this.issueToken(user, device, true);
    const accessToken = await this.issueToken(user, device, false);

    if (this.redis) {
      try {
        await this.redis.set(
          `access_token:${accessToken}`,
          JSON.stringify(user),
          "EX",
          300, // 5분
        );

        await this.redis.del(`refresh_token:${user.id}:${device}`);

        await this.redis.set(
          `refresh_token:${user.id}:${device}`,
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
    } catch {
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

    return user;
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
    const refreshTokenSecret = this.configService.getOrThrow<string>(
      "REFRESH_TOKEN_SECRET",
    );
    const accessTokenSecret = this.configService.getOrThrow<string>(
      "ACCESS_TOKEN_SECRET",
    );

    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      device: device,
      type: isRefreshToken ? "refresh" : "access",
    };

    return this.jwtService.signAsync(payload, {
      secret: isRefreshToken ? refreshTokenSecret : accessTokenSecret,
      expiresIn: isRefreshToken ? "1h" : "5m",
    });
  }
}
