import { IsString, IsOptional, Length, Matches } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(1, 20, {
    message: "닉네임은 1자 이상 20자 이하여야 합니다.",
  })
  @Matches(/^[가-힣a-zA-Z0-9]+$/, {
    message: "닉네임은 한글, 영어, 숫자만 사용할 수 있습니다.",
  })
  nickname?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  stateMessage?: string;
}
