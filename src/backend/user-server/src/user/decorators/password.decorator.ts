import { applyDecorators } from "@nestjs/common";
import { Length, Matches } from "class-validator";

export function IsPassword() {
  return applyDecorators(
    Length(8, 20, {
      message: "비밀번호는 8자 이상 20자 이하여야 합니다.",
    }),
    Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, {
      message:
        "비밀번호는 영어, 숫자, 특수문자를 포함해야 합니다. 최소 8자 이상 최대 20자 이하여야 합니다.",
    }),
  );
}
