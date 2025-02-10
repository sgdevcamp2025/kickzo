import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Authorization } from "./decorator/authorization.decorator";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ParseBearerTokenDto } from "./dto/parse-bearer-token.dto";
import { DeviceTypeDto } from "./dto/device-type.dto";
import {
  MESSAGES,
  RAW_TOKEN_TYPE,
  TOKEN_EXPIRATION_TIME,
  TOKEN_TYPE,
} from "./constants/constants";
import { DeviceType } from "./enum/device-type.enum";
import { Request, Response } from "express";

@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @UsePipes(ValidationPipe)
  async loginUser(
    @Authorization() token: string,
    @Body() deviceDto: DeviceTypeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!token) {
      throw new UnauthorizedException(MESSAGES.INVALID_TOKEN);
    }
    const tokens = await this.authService.login(token, deviceDto.device);

    if (deviceDto.device === DeviceType.WEB) {
      res.cookie(TOKEN_TYPE.REFRESH, tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: TOKEN_EXPIRATION_TIME.REFRESH * 1000,
        path: "/api/auth/token/refresh",
      });

      return { accessToken: tokens.accessToken };
    }

    return tokens;
  }

  @Post("logout")
  @HttpCode(200)
  async logout(
    @Authorization() accessToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!accessToken) {
      throw new UnauthorizedException(MESSAGES.INVALID_TOKEN);
    }
    const result = await this.authService.logout(accessToken);
    res.clearCookie(TOKEN_TYPE.REFRESH, {
      path: "/api/auth/token/refresh",
    });
    return result;
  }

  @Post("token/refresh")
  async rotateAccessToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // WEB
    const cookies = req.cookies as Record<string, string>;
    let refreshToken = cookies?.[TOKEN_TYPE.REFRESH];
    // iOS
    if (!refreshToken && req.headers.authorization) {
      const [type, token] = req.headers.authorization.split(" ");
      if (type === RAW_TOKEN_TYPE.BEARER) {
        refreshToken = token;
      }
    }

    if (!refreshToken) {
      throw new UnauthorizedException(MESSAGES.INVALID_TOKEN);
    }

    const rawToken = `${RAW_TOKEN_TYPE.BEARER} ${refreshToken}`;

    try {
      const tokens = await this.authService.updateTokens(rawToken);

      if (cookies[TOKEN_TYPE.REFRESH]) {
        res.cookie(TOKEN_TYPE.REFRESH, tokens.refreshToken, {
          httpOnly: true,
          secure: false,
          maxAge: TOKEN_EXPIRATION_TIME.REFRESH * 1000,
          path: "/api/auth/token/refresh",
        });

        return { accessToken: tokens.accessToken };
      }

      return tokens;
    } catch (error) {
      if (
        error instanceof UnauthorizedException &&
        error.getResponse()["clearCookie"]
      ) {
        res.clearCookie(TOKEN_TYPE.REFRESH, {
          path: "/api/auth/token/refresh",
        });
      }
      throw error;
    }
  }

  @Post("token/verify")
  @HttpCode(200)
  async verifyAccessToken(@Authorization() accessToken: string) {
    if (!accessToken) {
      throw new UnauthorizedException(MESSAGES.INVALID_TOKEN);
    }
    return await this.authService.validateStoredToken(accessToken);
  }

  @MessagePattern({
    cmd: "parse_bearer_token",
  })
  @UsePipes(ValidationPipe)
  parseBearerToken(@Payload() payload: ParseBearerTokenDto) {
    return this.authService.parseBearerToken(payload.token, false);
  }
}

/* NOTE: 할 일 정리
- [x] Access, Refresh Token 쿠키로 변경
- [x] token/access에서 Refresh Token도 갱신하는 걸로 변경
- [ ] 비밀번호 재설정 - 이메일로 유효한 code 넣어서 보내기
- [ ] 비밀번호 변경 토큰 확인 - 유효한 코드인지 확인
- [ ] 비밀번호 변경(리셋 토큰 + 비밀번호) 받기
*/
