import { Module } from '@nestjs/common';
import { TotalCountRepository } from './repositories/total-count.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [TotalCountRepository],
  exports: [],
})
export class TotalCountModule {}
