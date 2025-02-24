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
  Query,
  BadRequestException,
  Delete,
  Patch,
  DefaultValuePipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { Request } from "express";
import { UnauthorizedException } from "@nestjs/common";
import { CheckExistsDto } from "./dto/check-exists.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { MESSAGES } from "./constants/constants";
import { VERSION_NEUTRAL } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ProfileImageDto } from "./dto/profile-image.dto";

@Controller({ path: "api/users", version: VERSION_NEUTRAL })
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  @ApiOperation({ summary: "회원가입" })
  @UsePipes(ValidationPipe)
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Delete("unregister")
  @ApiBearerAuth()
  @ApiOperation({ summary: "회원탈퇴" })
  async deleteUser(@Req() req: Request) {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      throw new UnauthorizedException(MESSAGES.UNAUTHORIZED_IN_HEADER);
    }
    return await this.userService.delete(+userId);
  }

  @Get("exists")
  @ApiOperation({
    summary: "닉네임, 이메일 중복 체크(닉네임 또는 이메일 중 하나만 전달)",
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async checkExists(@Query() query: CheckExistsDto) {
    if (query.nickname && query.email) {
      throw new BadRequestException(MESSAGES.NICKNAME_AND_EMAIL);
    }

    if (query.nickname) {
      return this.userService.checkNicknameExists(query.nickname);
    }
    if (query.email) {
      return this.userService.checkEmailExists(query.email);
    }
  }

  @Get("me")
  @ApiBearerAuth()
  @ApiOperation({ summary: "내 정보 조회" })
  async getMyInfo(@Req() req: Request) {
    const id = req.headers["x-user-id"];
    if (!id) {
      throw new UnauthorizedException(MESSAGES.UNAUTHORIZED_IN_HEADER);
    }
    return this.userService.getUserById(+id);
  }

  @Patch("me/profile-image")
  @ApiBearerAuth()
  @ApiOperation({ summary: "프로필 이미지 수정" })
  async updateProfileImage(
    @Req() req: Request,
    @Body() profileImageDto: ProfileImageDto,
  ) {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      throw new UnauthorizedException(MESSAGES.UNAUTHORIZED_IN_HEADER);
    }
    return await this.userService.updateProfileImage(
      +userId,
      profileImageDto.profileImageUrl,
    );
  }

  @Patch("me")
  @ApiBearerAuth()
  @ApiOperation({ summary: "내 정보 수정" })
  @UsePipes(ValidationPipe)
  async updateProfile(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      throw new UnauthorizedException(MESSAGES.UNAUTHORIZED_IN_HEADER);
    }
    if (!updateUserDto) {
      throw new BadRequestException(MESSAGES.NO_UPDATE_INFO);
    }
    return await this.userService.updateProfile(+userId, updateUserDto);
  }

  @Get()
  @ApiOperation({ summary: "모든 유저 조회" })
  async findAll(
    @Query("page", new DefaultValuePipe(0), ParseIntPipe) page: number = 0,
    @Query("size", new DefaultValuePipe(10), ParseIntPipe) size: number = 10,
    @Query("nickname") nickname?: string,
  ) {
    return this.userService.findAll(page, size, nickname);
  }

  @Get(":id")
  @ApiOperation({ summary: "유저 조회" })
  async getUserById(@Param("id", ParseIntPipe) id: string) {
    return this.userService.getUserById(+id);
  }

  @MessagePattern({ cmd: "get_user_by_email" })
  @UsePipes(ValidationPipe)
  async getUserByEmail(@Payload() payload: { email: string }) {
    const user = await this.userService.getUserByEmail(payload.email);
    return user;
  }

  @MessagePattern({ cmd: "get_user_with_password_by_email" })
  @UsePipes(ValidationPipe)
  async getUserWithPasswordByEmail(@Payload() payload: { email: string }) {
    const user = await this.userService.getUserByEmail(payload.email, true);
    if (!user) {
      return null;
    }
    const userWithPassword = {
      ...user,
      password: user.getPassword(),
    };
    return userWithPassword;
  }
}
