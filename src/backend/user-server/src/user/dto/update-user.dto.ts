import { IsString, IsOptional, Length } from "class-validator";
import { IsNickname } from "../decorators/nickname.decorator";
import { LENGTH_LIMIT, MESSAGES } from "../constants/constants";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNickname()
  @ApiProperty({
    description: "닉네임(한글, 영어, 숫자 포함 최소 1자 최대 20자)",
    example: "test",
  })
  nickname?: string;

  @IsOptional()
  @IsString()
  @Length(LENGTH_LIMIT.STATE_MESSAGE_MIN, LENGTH_LIMIT.STATE_MESSAGE_MAX, {
    message: MESSAGES.STATE_MESSAGE_LENGTH,
  })
  @ApiProperty({
    description: "상태 메시지(최소 0자 최대 100자)",
    example: "hello world!",
  })
  stateMessage?: string;
}
