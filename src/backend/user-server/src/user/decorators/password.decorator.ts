import { applyDecorators } from "@nestjs/common";
import { Length, Matches } from "class-validator";
import { MESSAGES, REGEX } from "../constants/constants";

export function IsPassword() {
  return applyDecorators(
    Length(8, 20, {
      message: MESSAGES.PASSWORD_LENGTH,
    }),
    Matches(REGEX.PASSWORD, {
      message: MESSAGES.PASSWORD_FORMAT,
    }),
  );
}
