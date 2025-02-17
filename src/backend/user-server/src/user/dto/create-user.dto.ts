import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { IsNickname } from "../decorators/nickname.decorator";
import { IsPassword } from "../decorators/password.decorator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: "이메일",
    example: "test@test.com",
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsNickname()
  @ApiProperty({
    description: "닉네임(한글, 영어, 숫자 포함 최소 1자 최대 20자)",
    example: "test",
  })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @IsPassword()
  @ApiProperty({
    description: "비밀번호(영어, 숫자, 특수문자 포함 최소 8자 최대 20자)",
    example: "test1234#",
  })
  password: string;
}
