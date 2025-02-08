export const REDIS_KEY = {
  REFRESH_TOKEN: (id: number, platform: "web" | "mobile") =>
    `refresh_token:${id}:${platform}`,
  ACCESS_TOKEN: (id: number, platform: "web" | "mobile") =>
    `access_token:${id}:${platform}`,
} as const;
