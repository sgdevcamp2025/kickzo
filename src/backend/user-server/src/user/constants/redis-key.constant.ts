import { DeviceType } from "../enum/device-type.enum";

export const REDIS_KEY = {
  REFRESH_TOKEN: (id: number, platform: DeviceType) =>
    `refresh_token:${id}:${platform}`,
  ACCESS_TOKEN: (id: number, platform: DeviceType) =>
    `access_token:${id}:${platform}`,
} as const;
