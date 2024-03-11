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
    /**
     * 마지막 배포 단계가 되면 production 환경은 로컬에서의 요청은 아예 허용하지 않음. 오직 프론트의 https 적용된 프론트 도메인만 허용.
     * 추후 development 환경의 서버를 새로 개설해야 함.
     * staging server 까지 따로 열 계획은 없기 때문에 환경 자체는 최대한 운영 서버 환경과 거의 100% 비슷할 정도로 환경을 맞춰야 함.
     * development 환경의 허용 도메인은 development 환경의 프론트 서버 도메인 및 로컬에서의 요청 허용
     * 추후 프론트의 admin 전용 서버가 열리면 production 환경에서 프론트의 admin 서버 도메인도 허용(아마 development 환경에서도)
     */
    origin:
      process.env.NODE_ENV === 'production'
        ? [
            process.env.FRONT_PRODUCTION_DOMAIN,
            process.env.FRONT_PRODUCTION_WWW_DOMAIN,
            process.env.FRONT_LOCAL_DOMAIN,
          ]
        : 'development'
          ? [
              process.env.FRONT_DEVELOPMENT_DOMAIN,
              process.env.FRONT_DEVELOPMENT_WWW_DOMAIN,
              process.env.FRONT_LOCAL_DOMAIN,
            ]
          : true, // 또는 특정 도메인을 설정
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

  const asyncApiDocument = AsyncApiModule.createDocument(app, asyncApiOptions);
  // if (process.env.NODE_ENV !== 'production') {
  await AsyncApiModule.setup('asyncapi', app, asyncApiDocument);
  // }
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
