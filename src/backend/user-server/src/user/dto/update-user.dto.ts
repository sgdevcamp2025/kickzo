import { IsString, IsOptional, Length } from "class-validator";
import { IsNickname } from "../decorators/nickname.decorator";
import { LENGTH_LIMIT, MESSAGES } from "../constants/constants";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNickname()
  nickname?: string;

  @IsOptional()
  @IsString()
  @Length(LENGTH_LIMIT.STATE_MESSAGE_MIN, LENGTH_LIMIT.STATE_MESSAGE_MAX, {
    message: MESSAGES.STATE_MESSAGE_LENGTH,
  })
  stateMessage?: string;
}
