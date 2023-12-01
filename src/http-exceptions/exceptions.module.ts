import { Module } from '@nestjs/common';
import { HttpExceptionService } from './services/http-exception.service';
import { HttpBadRequestExceptionFilter } from './exception-filters/http-bad-request-exception.filter';
import { HttpUnauthorizedExceptionFilter } from './exception-filters/http-unauthorized-exception.filter';
import { HttpForbiddenExceptionFilter } from './exception-filters/http-forbidden-exception.filter';
import { HttpNotFoundExceptionFilter } from './exception-filters/http-not-found-exception';

@Module({
  providers: [
    HttpExceptionService,
    HttpBadRequestExceptionFilter,
    HttpUnauthorizedExceptionFilter,
    HttpForbiddenExceptionFilter,
    HttpNotFoundExceptionFilter,
  ],
})
export class ExceptionsModule {}
