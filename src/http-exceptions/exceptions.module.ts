import { Module } from '@nestjs/common';
import { ExceptionsService } from './services/exceptions.service';

@Module({
  providers: [ExceptionsService],
})
export class ExceptionsModule {}
