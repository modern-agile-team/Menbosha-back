import { Module } from '@nestjs/common';
import { HttpExceptionService } from './services/http-exception.service';
import { HttpBadRequestExceptionFilter } from './exception-filters/http-bad-request.exception.filter';
import { HttpUnauthorizedExceptionFilter } from './exception-filters/http-unauthorized.exception.filter';

@Module({
  providers: [
    HttpExceptionService,
    HttpBadRequestExceptionFilter,
    HttpUnauthorizedExceptionFilter,
  ],
})
export class ExceptionsModule {}
