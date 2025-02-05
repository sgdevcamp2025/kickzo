import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { AuthModule } from "./auth/auth.module";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { RedisModule } from "@liaoliaots/nestjs-redis";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        AUTH_PORT: Joi.number().required(),
        HASH_ROUNDS: Joi.number().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
      }),
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: "USER_SERVICE",
          useFactory: () => ({
            transport: Transport.TCP,
            options: {
              host: "user",
              port: 3001,
            },
          }),
        },
      ],
      isGlobal: true, // NOTE: 꼭 적어야 내부에서 TCP 통신할 수 있음
    }),
    RedisModule.forRoot({
      readyLog: true,
      config: {
        host: process.env.REDIS_HOST ?? "redis",
        port: parseInt(process.env.REDIS_CONTAINER_PORT ?? "6379"),
      },
    }),
    AuthModule,
  ],
})
export class AppModule {}
