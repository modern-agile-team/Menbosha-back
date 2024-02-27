import { Injectable } from '@nestjs/common';
import { CreateReportBodyDto } from '@src/reports/dto/create-report-body.dto';
import { Report } from '@src/reports/entities/report.entity';
import { EntityManager, UpdateResult } from 'typeorm';

@Injectable()
export class ReportRepository {
  constructor(private readonly entityManager: EntityManager) {}

  create(
    createReportBodyDto: CreateReportBodyDto,
    reportUserId: number,
    reportedUserId: number,
  ): Promise<Report> {
    return this.entityManager
      .getRepository(Report)
      .save({ ...createReportBodyDto, reportUserId, reportedUserId });
  }

  findAllAndCount(
    skip: number,
    pageSize: number,
    where: Record<string, any>,
    order: Record<string, any>,
  ): Promise<[Report[], number]> {
    return this.entityManager.getRepository(Report).findAndCount({
      select: ['id', 'type', 'reportUserId', 'reportedUserId', 'createdAt'],
      where,
      order,
      skip,
      take: pageSize,
    });
  }

  findOneBy(reportId: number): Promise<Report> {
    return this.entityManager.getRepository(Report).findOneBy({ id: reportId });
  }

  delete(reportId: number): Promise<UpdateResult> {
    return this.entityManager
      .getRepository(Report)
      .update({ id: reportId }, { deletedAt: new Date() });
  }
}
