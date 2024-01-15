import { Module } from '@nestjs/common';
import { TotalCountRepository } from './repositories/total-count.repository';
import { TotalCountService } from './services/total-count.service';

@Module({
  imports: [],
  controllers: [],
  providers: [TotalCountRepository, TotalCountService],
  exports: [TotalCountRepository, TotalCountService],
})
export class TotalCountModule {}
