import { Injectable } from '@nestjs/common';
import { CreateReportBodyDto } from 'src/reports/dto/create-report-body.dto';
import { ReportDto } from 'src/reports/dto/report.dto';
import { ReportRepository } from 'src/reports/repositories/report.repository';
import { UserService } from 'src/users/services/user.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly userService: UserService,
    private readonly reportRepository: ReportRepository,
  ) {}

  async create(
    createReportBodyDto: CreateReportBodyDto,
    reportUserId: number,
    reportedUserId: number,
  ): Promise<ReportDto> {
    const user = await this.userService.findOneByOrNotFound({
      where: {
        id: reportedUserId,
      },
    });

    const report = await this.reportRepository.create(
      { ...createReportBodyDto },
      reportUserId,
      user.id,
    );

    return new ReportDto(report);
  }
}
