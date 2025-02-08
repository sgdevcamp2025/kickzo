import { IsString, IsOptional, Length } from "class-validator";
import { IsNickname } from "../decorators/nickname.decorator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNickname()
  nickname?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  stateMessage?: string;
}
