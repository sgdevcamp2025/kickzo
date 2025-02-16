import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("Kicktube User API")
    .setDescription("Kicktube User API 설명입니다.")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/users/doc", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
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

  await app.listen(process.env.USER_PORT ?? 3102);
}
bootstrap();
