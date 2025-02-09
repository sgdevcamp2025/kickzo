import { DeviceType } from "../enum/device-type.enum";
import { TOKEN_TYPE } from "./constants";

export const REDIS_KEY = {
  REFRESH_TOKEN: (id: number, platform: DeviceType) =>
    `${TOKEN_TYPE.REFRESH}:${id}:${platform}`,
  ACCESS_TOKEN: (id: number, platform: DeviceType) =>
    `${TOKEN_TYPE.ACCESS}:${id}:${platform}`,
} as const;
