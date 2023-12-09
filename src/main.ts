import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/swagger';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';
import * as cookieParser from 'cookie-parser';
// import { HttpBadRequestExceptionFilter } from './http-exceptions/exception-filters/http-bad-request-exception.filter';
// import { HttpProcessErrorExceptionFilter } from './http-exceptions/exception-filters/http-process-error-exception.filter';
// import { HttpRemainderExceptionFilter } from './http-exceptions/exception-filters/http-remainder-exception.filter';
// import { HttpInternalServerErrorExceptionFilter } from './http-exceptions/exception-filters/http-internal-server-error-exception.filter';
// import { HttpConflictExceptionFilter } from './http-exceptions/exception-filters/http-conflict-exception.filter';
// import { HttpNotFoundExceptionFilter } from './http-exceptions/exception-filters/http-not-found-exception';
// import { HttpPathNotFoundExceptionFilter } from './http-exceptions/exception-filters/http-path-not-found-exception';
// import { HttpForbiddenExceptionFilter } from './http-exceptions/exception-filters/http-forbidden-exception.filter';
// import { HttpUnauthorizedExceptionFilter } from './http-exceptions/exception-filters/http-unauthorized-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  app.useGlobalPipes(new ValidationPipe());
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

  const asyncApiDocument = await AsyncApiModule.createDocument(
    app,
    asyncApiOptions,
  );
  await AsyncApiModule.setup('asyncapi', app, asyncApiDocument);
  app.useLogger(logger);

  // app.useGlobalFilters(
  //   app.get(HttpProcessErrorExceptionFilter),
  //   app.get(HttpRemainderExceptionFilter),
  //   app.get(HttpInternalServerErrorExceptionFilter),
  //   app.get(HttpConflictExceptionFilter),
  //   app.get(HttpNotFoundExceptionFilter),
  //   app.get(HttpPathNotFoundExceptionFilter),
  //   app.get(HttpForbiddenExceptionFilter),
  //   app.get(HttpUnauthorizedExceptionFilter),
  //   app.get(HttpBadRequestExceptionFilter),
  // );

  await app.listen(3000);
}
bootstrap();
