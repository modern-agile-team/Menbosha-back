import { Module } from '@nestjs/common';
import { BannedUserExceptionFilter } from '@src/http-exceptions/exception-filters/banned-user-exception.filter';
import { HttpBadRequestExceptionFilter } from '@src/http-exceptions/exception-filters/http-bad-request-exception.filter';
import { HttpConflictExceptionFilter } from '@src/http-exceptions/exception-filters/http-conflict-exception.filter';
import { HttpForbiddenExceptionFilter } from '@src/http-exceptions/exception-filters/http-forbidden-exception.filter';
import { HttpInternalServerErrorExceptionFilter } from '@src/http-exceptions/exception-filters/http-internal-server-error-exception.filter';
import { HttpNotFoundExceptionFilter } from '@src/http-exceptions/exception-filters/http-not-found-exception';
import { HttpPathNotFoundExceptionFilter } from '@src/http-exceptions/exception-filters/http-path-not-found-exception';
import { HttpProcessErrorExceptionFilter } from '@src/http-exceptions/exception-filters/http-process-error-exception.filter';
import { HttpRemainderExceptionFilter } from '@src/http-exceptions/exception-filters/http-remainder-exception.filter';
import { HttpUnauthorizedExceptionFilter } from '@src/http-exceptions/exception-filters/http-unauthorized-exception.filter';
import { HttpExceptionService } from '@src/http-exceptions/services/http-exception.service';

@Module({
  providers: [
    HttpExceptionService,
    BannedUserExceptionFilter,
    HttpBadRequestExceptionFilter,
    HttpUnauthorizedExceptionFilter,
    HttpForbiddenExceptionFilter,
    HttpNotFoundExceptionFilter,
    HttpPathNotFoundExceptionFilter,
    HttpConflictExceptionFilter,
    HttpInternalServerErrorExceptionFilter,
    HttpProcessErrorExceptionFilter,
    HttpRemainderExceptionFilter,
  ],
})
export class ExceptionsModule {}
