import axios from "axios";

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response?.data) {
    const message = error.response.data.message;
    if (typeof message === "string") {
      return message;
    }
  }
  return "알 수 없는 오류가 발생했습니다.";
};
