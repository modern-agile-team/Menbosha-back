import { NestFactory } from '@nestjs/core';
import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';

import { setupSwagger } from '@src/config/swagger';
import { AppModule } from '@src/app.module';
// import { HttpBadRequestExceptionFilter } from '@src/http-exceptions/exception-filters/http-bad-request-exception.filter';
// import { HttpConflictExceptionFilter } from '@src/http-exceptions/exception-filters/http-conflict-exception.filter';
import { HttpForbiddenExceptionFilter } from '@src/http-exceptions/exception-filters/http-forbidden-exception.filter';
import { BannedUserExceptionFilter } from '@src/http-exceptions/exception-filters/banned-user-exception.filter';
import { config } from 'dotenv';
// import { HttpInternalServerErrorExceptionFilter } from '@src/http-exceptions/exception-filters/http-internal-server-error-exception.filter';
// import { HttpNotFoundExceptionFilter } from '@src/http-exceptions/exception-filters/http-not-found-exception';
// import { HttpPathNotFoundExceptionFilter } from '@src/http-exceptions/exception-filters/http-path-not-found-exception';
// import { HttpProcessErrorExceptionFilter } from '@src/http-exceptions/exception-filters/http-process-error-exception.filter';
// import { HttpRemainderExceptionFilter } from '@src/http-exceptions/exception-filters/http-remainder-exception.filter';
// import { HttpUnauthorizedExceptionFilter } from '@src/http-exceptions/exception-filters/http-unauthorized-exception.filter';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  app.useLogger(logger);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? [process.env.FRONT_DOMAIN, 'http://localhost:3000']
        : 'http://localhost:3000', // 또는 특정 도메인을 설정
    methods: 'GET ,HEAD, PUT, PATCH, POST, DELETE',
    credentials: true, // 이 옵션을 true로 설정하여 쿠키 전송을 허용
    optionsSuccessStatus: HttpStatus.NO_CONTENT,
  });
  app.use(cookieParser());
  setupSwagger(app);
  const asyncApiOptions = new AsyncApiDocumentBuilder()
    .setTitle('ma6-main-asyncapi')
    .setDescription('모던애자일 6기 메인프로젝트 AsyncAPI 문서')
    .setVersion('1.0')
    .setDefaultContentType('application/json')
    .build();

  console.log(process.env.NODE_ENV);

  const asyncApiDocument = AsyncApiModule.createDocument(app, asyncApiOptions);
  await AsyncApiModule.setup('asyncapi', app, asyncApiDocument);
  app.useLogger(logger);

  app.useGlobalFilters(
    // app.get(HttpProcessErrorExceptionFilter),
    // app.get(HttpRemainderExceptionFilter),
    // app.get(HttpInternalServerErrorExceptionFilter),
    // app.get(HttpConflictExceptionFilter),
    // app.get(HttpNotFoundExceptionFilter),
    // app.get(HttpPathNotFoundExceptionFilter),
    app.get(HttpForbiddenExceptionFilter),
    app.get(BannedUserExceptionFilter),
    // app.get(HttpUnauthorizedExceptionFilter),
    // app.get(HttpBadRequestExceptionFilter),
  );

  await app.listen(3000);
}
bootstrap();
