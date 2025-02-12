/**
 * 문자열 byte 길이를 반환합니다.
 *
 * 영어 1자 = 1byte, 한글 1자 = 3byte
 * @param str 문자열
 * @returns byte 길이
 */
export const getByteLength = (str: string) => {
  return new TextEncoder().encode(str).length;
};
