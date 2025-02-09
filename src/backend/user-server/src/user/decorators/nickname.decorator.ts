import { applyDecorators } from "@nestjs/common";
import { Length, Matches } from "class-validator";
import { MESSAGES, LENGTH_LIMIT, REGEX } from "../constants/constants";
export function IsNickname() {
  return applyDecorators(
    Length(LENGTH_LIMIT.NICKNAME_MIN, LENGTH_LIMIT.NICKNAME_MAX, {
      message: MESSAGES.NICKNAME_LENGTH,
    }),
    Matches(REGEX.NICKNAME, {
      message: MESSAGES.NICKNAME_FORMAT,
    }),
  );
}
