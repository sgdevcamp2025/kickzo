import {
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Authorization } from "./decorator/authorization.decorator";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ParseBearerTokenDto } from "./dto/parse-bearer-token.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("v1/login")
  @UsePipes(ValidationPipe)
  loginUser(@Authorization() token: string) {
    if (!token) {
      throw new UnauthorizedException("토큰이 없습니다.");
    }
    return this.authService.login(token); // TODO: 쿠키로 전달하기
  }

  @Post("v1/token/refresh") /// TODO: Refresh Token도 같이 갱신하기
  async rotateAccessToken(@Authorization() token: string) {
    const payload = await this.authService.parseBearerToken(token, true);

    return { acceessToken: await this.authService.issueToken(payload, false) };
  }

  // @Post('v1/token/refresh')
  // async rotateRefreshToken(@Authorization() token: string) {
  //   const payload = await this.authService.parseBearerToken(token, true);

  //   return { refreshToken: await this.authService.issueToken(payload, true) };
  // }

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
