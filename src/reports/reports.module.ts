import { Module } from '@nestjs/common';
import { UserModule } from '@src/users/user.module';
import { ReportRepository } from '@src/reports/repositories/report.repository';
import { ReportsController } from '@src/reports/controllers/reports.controller';
import { ReportsService } from '@src/reports/services/reports.service';

@Module({
  imports: [UserModule],
  controllers: [ReportsController],
  providers: [ReportsService, ReportRepository],
})
export class ReportsModule {}
