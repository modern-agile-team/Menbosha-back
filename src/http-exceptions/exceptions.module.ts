import { Module } from '@nestjs/common';
import { HttpExceptionService } from './services/http-exception.service';
import { HttpBadRequestExceptionFilter } from './exception-filters/http-bad-request.exception.filter';

@Module({
  providers: [HttpExceptionService, HttpBadRequestExceptionFilter],
})
export class ExceptionsModule {}
