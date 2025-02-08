export const MESSAGES = {
  NICKNAME_LENGTH: "닉네임은 1자 이상 20자 이하여야 합니다.",
  NICKNAME_FORMAT: "닉네임은 한글, 영어, 숫자만 사용할 수 있습니다.",
  PASSWORD_LENGTH: "비밀번호는 8자 이상 20자 이하여야 합니다.",
  PASSWORD_FORMAT:
    "비밀번호는 영어, 숫자, 특수문자를 포함해야 합니다. 최소 8자 이상 최대 20자 이하여야 합니다.",
  STATE_MESSAGE_LENGTH: "상태 메시지는 0자 이상 100자 이하여야 합니다.",

  EMAIL_IN_USE: "이미 사용 중인 이메일입니다.",
  NICKNAME_IN_USE: "이미 사용 중인 닉네임입니다.",
  USER_NOT_FOUND: "사용자를 찾을 수 없습니다.",
  DELETION_ERROR: "회원 탈퇴 처리 중 오류가 발생했습니다.",
  NICKNAME_AVAILABLE: "사용 가능한 닉네임입니다.",
  EMAIL_AVAILABLE: "사용 가능한 이메일입니다.",
};

export const REGEX = {
  NICKNAME: /^[가-힣a-zA-Z0-9]+$/,
  PASSWORD: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
};

export const LENGTH_LIMIT = {
  NICKNAME_MIN: 1,
  NICKNAME_MAX: 20,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 20,
  STATE_MESSAGE_MIN: 0,
  STATE_MESSAGE_MAX: 100,
};
