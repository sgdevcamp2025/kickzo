export const MESSAGES = {
  INVALID_DEVICE: "유효하지 않은 기기 타입입니다.",
  REQUIRED_DEVICE: "기기 타입이 필요합니다.",
  REDIS_ERROR: "Redis에 토큰을 저장하는데 실패했습니다.",
  LOGOUT_SUCCESS: "로그아웃 되었습니다.",
  INVALID_TOKEN_FORMAT: "토큰 포맷이 잘못됐습니다.",
  INVALID_TOKEN_TYPE: "토큰 타입이 잘못됐습니다.",
  INVALID_LOGIN_INFO: "잘못된 로그인 정보입니다.",
  VALID_TOKEN: "토큰이 유효합니다.",
  INVALID_TOKEN: "토큰이 유효하지 않습니다.",
  EXPIRED_TOKEN: "토큰이 만료되었습니다.",
};

export const TOKEN_TYPE = {
  ACCESS: "access_token",
  REFRESH: "refresh_token",
} as const;

export const TOKEN_EXPIRATION_TIME = {
  ACCESS: 300, // 5분
  REFRESH: 3600, // 1시간
  // ACCESS: 3600, // 1시간
  // REFRESH: 604800, // 7일
} as const;

export const RAW_TOKEN_TYPE = {
  BEARER: "Bearer",
  BASIC: "Basic",
} as const;
