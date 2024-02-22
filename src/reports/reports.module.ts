import { Module } from '@nestjs/common';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import { UserModule } from 'src/users/user.module';
import { ReportRepository } from 'src/reports/repositories/report.repository';

@Module({
  imports: [UserModule],
  controllers: [ReportsController],
  providers: [ReportsService, ReportRepository],
})
export class ReportsModule {}
