import helmet from 'helmet';
import * as morgan from 'morgan';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { applicationConfig } from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
  });

  app.useGlobalPipes(new ValidationPipe());

  app.use(morgan('combined'));

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Backend Apis')
    .setDescription('')
    .setVersion('1.0')
    .addTag('BackendApis')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api-docs', app, swaggerDocument);

  const response = await app.listen(applicationConfig.app.port, '0.0.0.0');
  const serverAddress = response.address();

  console.log(
    `Server is listening 🎧 at http://${serverAddress.address}:${serverAddress.port}`,
  );
  console.log(
    `Checkout Documentation 🧾 at http://${serverAddress.address}:${serverAddress.port}/api-docs`,
  );
}

bootstrap();
