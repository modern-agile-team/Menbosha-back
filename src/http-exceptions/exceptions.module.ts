import { Module } from '@nestjs/common';
import { HttpExceptionService } from './services/http-exception.service';
import { HttpBadRequestExceptionFilter } from './exception-filters/http-bad-request-exception.filter';
import { HttpUnauthorizedExceptionFilter } from './exception-filters/http-unauthorized-exception.filter';
import { HttpForbiddenExceptionFilter } from './exception-filters/http-forbidden-exception.filter';
import { HttpNotFoundExceptionFilter } from './exception-filters/http-not-found-exception';
import { HttpPathNotFoundExceptionFilter } from './exception-filters/http-path-not-found-exception';
import { HttpConflictExceptionFilter } from './exception-filters/http-conflict-exception.filter';

@Module({
  providers: [
    HttpExceptionService,
    HttpBadRequestExceptionFilter,
    HttpUnauthorizedExceptionFilter,
    HttpForbiddenExceptionFilter,
    HttpNotFoundExceptionFilter,
    HttpPathNotFoundExceptionFilter,
    HttpConflictExceptionFilter,
  ],
})
export class ExceptionsModule {}
