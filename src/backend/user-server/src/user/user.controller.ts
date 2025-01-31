import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("v1/register")
  @UseInterceptors(ClassSerializerInterceptor)
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get("profile/:id")
  async getUserById(@Param("id", ParseIntPipe) id: string) {
    return this.userService.getUserById(+id);
  }

  // @Get('v1/profile')
  // async getMyInfo(@Req() req: Request) {
  // const token = req.cookies['accessToken'] as string | undefined;
  // if (!token) {
  //   throw new UnauthorizedException('엑세스 토큰이 필요합니다.');
  // }
  // return this.userService.getUserById(+id);
  // }

  @MessagePattern({ cmd: "get_user_by_email" })
  @UsePipes(ValidationPipe)
  async getUserByEmail(@Payload() payload: { email: string }) {
    console.log("getUserByEmail", payload);
    const user = await this.userService.getUserByEmail(payload.email);
    console.log("user", user);
    return user;
  }

  @MessagePattern({ cmd: "get_user_with_password_by_email" })
  @UsePipes(ValidationPipe)
  async getUserWithPasswordByEmail(@Payload() payload: { email: string }) {
    console.log("getUserWithPasswordByEmail", payload);
    const user = await this.userService.getUserByEmail(payload.email, true);
    console.log("user", user);
    return user;
  }
}

/* NOTE: 할 일 정리
- [ ] 쿠피 파서 pnpm i cookie-parser
- [ ] main.ts에 쿠키 파서 추가
*/
