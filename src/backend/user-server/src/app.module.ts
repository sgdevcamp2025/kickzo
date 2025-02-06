import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Joi from "joi";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { RedisModule } from "@liaoliaots/nestjs-redis";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        USER_PORT: Joi.number().required(),
        MYSQL_HOST: Joi.string().required(),
        MYSQL_CONTAINER_PORT: Joi.number().required(),
        MYSQL_USER: Joi.string().required(),
        MYSQL_PASSWORD: Joi.string().required(),
        MYSQL_DATABASE: Joi.string().required(),
        HASH_ROUNDS: Joi.number().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get("MYSQL_HOST"),
        port: configService.get("MYSQL_CONTAINER_PORT"),
        username: configService.get("MYSQL_USER"),
        password: configService.get("MYSQL_PASSWORD"),
        database: configService.get("MYSQL_DATABASE"),
        autoLoadEntities: true,
        synchronize: false,
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRoot({
      readyLog: true,
      config: {
        host: process.env.REDIS_HOST ?? "redis",
        port: parseInt(process.env.REDIS_CONTAINER_PORT ?? "6379"),
      },
    }),
    UserModule,
  ],
})
export class AppModule {}
