import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { Request } from "express";
import { UnauthorizedException } from "@nestjs/common";

@Controller("api/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
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

  @Get("profile")
  async getMyInfo(@Req() req: Request) {
    console.log("headers:", req.headers);
    const id = req.headers["x-user-id"];
    if (!id) {
      throw new UnauthorizedException("헤더에 아이디가 없습니다.");
    }
    return this.userService.getUserById(+id);
  }

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
