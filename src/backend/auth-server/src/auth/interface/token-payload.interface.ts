import { DeviceType } from "../enum/device-type.enum";
import { TOKEN_TYPE } from "../constants/constants";
export interface TokenPayload {
  id: number;
  email: string;
  role: number;
  device?: DeviceType;
  // access 토큰인지 refresh 토큰인지 구분하기 위한 필드
  type?: typeof TOKEN_TYPE.ACCESS | typeof TOKEN_TYPE.REFRESH;

  // 아래 필드는 optional: JWT가 부가적으로 쓰는 iat(발행시각), exp(만료시각) 등을 받을 수 있게
  iat?: number;
  exp?: number;
}
