import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { ConfigService } from "@nestjs/config";
import { TokenPayload } from "./interface/token-payload.interface";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { UserLoginDto } from "./dto/user-login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject("USER_SERVICE")
    private readonly userService: ClientProxy,
  ) {}

  async login(rawToken: string) {
    const { email, password } = this.parseBasicToken(rawToken);

    const user = await this.authenticate(email, password);

    return {
      refreshToken: await this.issueToken(user, true),
      accessToken: await this.issueToken(user, false),
    };
  }

  parseBasicToken(rawToken: string) {
    const basicSplit = rawToken.split(" ");
    if (basicSplit.length !== 2) {
      throw new BadRequestException("토큰 포멧이 잘못됐습니다.");
    }

    const [basic, token] = basicSplit;
    if (basic.toLowerCase() !== "basic") {
      throw new BadRequestException("토큰 포멧이 잘못됐습니다.");
    }

    const decoded = Buffer.from(token, "base64").toString("utf-8");

    const tokenSplit = decoded.split(":");
    if (tokenSplit.length !== 2) {
      throw new BadRequestException("토큰 포멧이 잘못됐습니다.");
    }

    const [email, password] = tokenSplit;

    return { email, password };
  }

  async parseBearerToken(rawToken: string, isRefreshToken: boolean) {
    const basicSplit = rawToken.split(" ");
    if (basicSplit.length !== 2) {
      throw new BadRequestException("토큰 포멧이 잘못됐습니다.");
    }

    const [bearer, token] = basicSplit;
    if (bearer.toLowerCase() !== "bearer") {
      throw new BadRequestException("토큰 포멧이 잘못됐습니다.");
    }

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
      throw new BadRequestException("토큰 포멧이 잘못됐습니다.");
    }
  }

  async authenticate(email: string, password: string) {
    const user = await this.getUserWithPasswordByEmail(email);
    console.log("user!!", user);
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

  async issueToken(user: TokenPayload, isRefreshToken: boolean) {
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
      type: isRefreshToken ? "refresh" : "access",
    };

    return this.jwtService.signAsync(payload, {
      secret: isRefreshToken ? refreshTokenSecret : accessTokenSecret,
      expiresIn: isRefreshToken ? "1h" : "5m",
    });
  }
}
