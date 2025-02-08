import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { IsNickname } from "../decorators/nickname.decorator";
import { IsPassword } from "../decorators/password.decorator";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsNickname()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @IsPassword()
  password: string;
}
