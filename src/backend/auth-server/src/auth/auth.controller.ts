import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Authorization } from "./decorator/authorization.decorator";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ParseBearerTokenDto } from "./dto/parse-bearer-token.dto";
import { DeviceTypeDto } from "./dto/device-type.dto";

@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @UsePipes(ValidationPipe)
  async loginUser(
    @Authorization() token: string,
    @Body() deviceDto: DeviceTypeDto,
  ) {
    if (!token) {
      throw new UnauthorizedException("토큰이 없습니다.");
    }
    return await this.authService.login(token, deviceDto.device); // TODO: 쿠키로 전달하기
  }

  @Post("logout")
  @HttpCode(200)
  async logout(@Authorization() accessToken: string) {
    if (!accessToken) {
      throw new UnauthorizedException("토큰이 없습니다.");
    }
    return await this.authService.logout(accessToken);
  }

  @Post("token/refresh")
  async rotateAccessToken(@Authorization() refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException("토큰이 없습니다.");
    }
    return await this.authService.updateTokens(refreshToken);
  }

  @Post("verify")
  @HttpCode(200)
  async verifyAccessToken(@Authorization() accessToken: string) {
    if (!accessToken) {
      throw new UnauthorizedException("토큰이 없습니다.");
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
- [ ] Access, Refresh Token 쿠키로 변경
- [ ] token/access에서 Refresh Token도 갱신하는 걸로 변경
- [ ] 비밀번호 재설정 - 이메일로 유효한 code 넣어서 보내기
- [ ] 비밀번호 변경 토큰 확인 - 유효한 코드인지 확인
- [ ] 비밀번호 변경(리셋 토큰 + 비밀번호) 받기

*/
