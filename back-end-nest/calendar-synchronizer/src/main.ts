import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
      .setVersion('1.0')
      .addCookieAuth('authorization', {
        type: 'apiKey',
        in: 'cookie',
        description: 'JWT Authorization cookie',
      })
      .build();


  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.use(cookieParser());


  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
