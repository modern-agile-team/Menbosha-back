import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/swagger';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';
import * as cookieParser from 'cookie-parser';
import { HttpBadRequestExceptionFilter } from './http-exceptions/exception-filters/http-bad-request-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: true, // 또는 특정 도메인을 설정
    methods: 'GET ,HEAD, PUT, PATCH, POST, DELETE',
    credentials: true, // 이 옵션을 true로 설정하여 쿠키 전송을 허용
  });
  app.use(cookieParser());
  setupSwagger(app);
  const asyncApiOptions = new AsyncApiDocumentBuilder()
    .setTitle('ma6-main-asyncapi')
    .setDescription('모던애자일 6기 메인프로젝트 AsyncAPI 문서')
    .setVersion('1.0')
    .setDefaultContentType('application/json')
    .build();

  const asyncapiDocument = await AsyncApiModule.createDocument(
    app,
    asyncApiOptions,
  );
  await AsyncApiModule.setup('asyncapi', app, asyncapiDocument);
  app.useLogger(logger);

  app.useGlobalFilters(app.get(HttpBadRequestExceptionFilter));

  await app.listen(3000);
}
bootstrap();
