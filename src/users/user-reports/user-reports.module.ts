import { Module } from '@nestjs/common';
import { UserReportsController } from './controllers/user-reports.controller';
import { UserReportsService } from './services/user-reports.service';

@Module({
  controllers: [UserReportsController],
  providers: [UserReportsService],
})
export class UserReportsModule {}
