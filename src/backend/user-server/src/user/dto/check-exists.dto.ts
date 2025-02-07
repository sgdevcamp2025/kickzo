import { IsEmail, IsString, Matches, ValidateIf } from "class-validator";
import { Transform } from "class-transformer";

interface ICheckExists {
  nickname?: string;
  email?: string;
}

export class CheckExistsDto {
  @ValidateIf((o: ICheckExists) => !o.email)
  @IsString()
  @Matches(/^[가-힣a-zA-Z0-9]+$/, {
    message: "닉네임은 한글, 영어, 숫자만 사용할 수 있습니다.",
  })
  @Transform(({ value }: { value: string }) => value?.trim())
  nickname?: string;

  @ValidateIf((o: ICheckExists) => !o.nickname)
  @IsEmail()
  @Transform(({ value }: { value: string }) => value?.trim())
  email?: string;
}
