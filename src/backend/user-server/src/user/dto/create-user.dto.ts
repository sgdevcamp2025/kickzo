import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20, {
    message: "닉네임은 1자 이상 20자 이하여야 합니다.",
  })
  @Matches(/^[가-힣a-zA-Z0-9]+$/, {
    message: "닉네임은 한글, 영어, 숫자만 사용할 수 있습니다.",
  })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 20, {
    message: "비밀번호는 8자 이상 20자 이하여야 합니다.",
  })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, {
    message:
      "비밀번호는 영어, 숫자, 특수문자를 포함해야 합니다. 최소 8자 이상 최대 20자 이하여야 합니다.",
  })
  password: string;
}
