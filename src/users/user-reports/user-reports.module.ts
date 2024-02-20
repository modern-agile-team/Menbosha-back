import { Module } from '@nestjs/common';
import { UserReportsController } from './user-reports.controller';
import { UserReportsService } from './user-reports.service';

@Module({
  controllers: [UserReportsController],
  providers: [UserReportsService],
})
export class UserReportsModule {}
