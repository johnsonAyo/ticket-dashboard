import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { LoggingInterceptor } from './common/logging.interceptor';
import { APP_CONFIG_NAMESPACE, type AppConfig } from './config/app.config';

const GLOBAL_PREFIX = 'api';
const SWAGGER_PATH = 'api/docs';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(ConfigService).getOrThrow<AppConfig>(APP_CONFIG_NAMESPACE);

  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.enableCors({ origin: appConfig.corsOrigin });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Support Ticket Dashboard API')
    .setDescription('REST API for listing, creating, viewing, and updating support tickets.')
    .setVersion('1.0')
    .build();
  SwaggerModule.setup(SWAGGER_PATH, app, SwaggerModule.createDocument(app, swaggerConfig));

  await app.listen(appConfig.port);
  console.log(`API listening on http://localhost:${appConfig.port}/${GLOBAL_PREFIX}`);
}

void bootstrap();
