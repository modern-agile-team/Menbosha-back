import { Module } from '@nestjs/common';
import { UserModule } from '@src/users/user.module';
import { ReportRepository } from '@src/reports/repositories/report.repository';
import { ReportsController } from '@src/reports/controllers/reports.controller';
import { ReportsService } from '@src/reports/services/reports.service';
import { QueryHelper } from '@src/helpers/query.helper';

@Module({
  imports: [UserModule],
  controllers: [ReportsController],
  providers: [ReportsService, ReportRepository, QueryHelper],
  exports: [ReportsService],
})
export class ReportsModule {}
