import { Module } from '@nestjs/common';
import { HttpExceptionService } from './services/http-exception.service';

@Module({
  providers: [HttpExceptionService],
})
export class ExceptionsModule {}
