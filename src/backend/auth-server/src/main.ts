import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import * as cookieParser from "cookie-parser";
import { VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("Kicktube Auth API")
    .setDescription("Kicktube Auth API 설명입니다.")
    .setVersion("1.0")
    .addBasicAuth()
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      "access",
    )
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      "refresh",
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/auth/doc", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.use(cookieParser());
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: "version",
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: "0.0.0.0",
      port: 3001,
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.AUTH_PORT ?? 8101);
}
bootstrap();
