import { IsEmail, IsString, ValidateIf } from "class-validator";
import { Transform } from "class-transformer";
import { IsNickname } from "../decorators/nickname.decorator";
import { ApiProperty } from "@nestjs/swagger";

interface ICheckExists {
  nickname?: string;
  email?: string;
}

export class CheckExistsDto {
  @ValidateIf((o: ICheckExists) => !o.email)
  @IsString()
  @IsNickname()
  @Transform(({ value }: { value: string }) => value?.trim())
  @ApiProperty({
    description: "닉네임(한글, 영어, 숫자 포함 최소 1자 최대 20자)",
    example: "test",
  })
  nickname?: string;

  @ValidateIf((o: ICheckExists) => !o.nickname)
  @IsEmail()
  @Transform(({ value }: { value: string }) => value?.trim())
  @ApiProperty({
    description: "이메일",
    example: "test@test.com",
  })
  email?: string;
}
