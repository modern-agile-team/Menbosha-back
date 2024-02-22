import { Injectable } from '@nestjs/common';
import { CreateReportBodyDto } from 'src/reports/dto/create-report-body.dto';
import { Report } from 'src/reports/entities/report.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class ReportRepository {
  constructor(private readonly entityManager: EntityManager) {}

  create(
    createReportBodyDto: CreateReportBodyDto,
    reportUserId: number,
    reportedUserId: number,
  ) {
    return this.entityManager
      .getRepository(Report)
      .save({ ...createReportBodyDto, reportUserId, reportedUserId });
  }
}
