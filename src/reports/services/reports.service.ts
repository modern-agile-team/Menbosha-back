import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ReportPageQueryDto } from '@src/reports/dto/report-page-query-dto';
import { QueryHelper } from '@src/helpers/query.helper';
import { CreateReportBodyDto } from '@src/reports/dto/create-report-body.dto';
import { ReportDto } from '@src/reports/dto/report.dto';
import { ReportsItemDto } from '@src/reports/dto/reports-item.dto';
import { ReportRepository } from '@src/reports/repositories/report.repository';
import { UserService } from '@src/users/services/user.service';
import { Report } from '@src/entities/Report';
import { plainToInstance } from 'class-transformer';
import { ReportsPaginationResponseDto } from '@src/reports/dto/reports-pagination-response.dto';
import { UpdateResult } from 'typeorm';

@Injectable()
export class ReportsService {
  private readonly LIKE_SEARCH_FIELD: readonly (keyof Pick<
    Report,
    'reason'
  >)[] = ['reason'];

  constructor(
    private readonly userService: UserService,
    private readonly reportRepository: ReportRepository,
    private readonly queryHelper: QueryHelper,
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

  async findAll(reportPageQueryDto: ReportPageQueryDto) {
    const { page, pageSize, orderField, sortOrder, ...filter } =
      reportPageQueryDto;

    const skip = (page - 1) * pageSize;

    const where = this.queryHelper.buildWherePropForFind(
      filter,
      this.LIKE_SEARCH_FIELD,
    );

    const order = this.queryHelper.buildOrderByPropForFind(
      orderField,
      sortOrder,
    );

    const [reports, totalCount] = await this.reportRepository.findAllAndCount(
      skip,
      pageSize,
      where,
      order,
    );

    const reportsItemDto = plainToInstance(ReportsItemDto, reports);

    return new ReportsPaginationResponseDto(
      reportsItemDto,
      totalCount,
      page,
      pageSize,
    );
  }

  async findOneOrNotFound(reportId: number): Promise<ReportDto> {
    const existReport = await this.findOneBy(reportId);

    if (!existReport) {
      throw new NotFoundException('해당 신고 정보를 찾지 못했습니다');
    }

    return existReport;
  }

  async findOneBy(reportId: number): Promise<ReportDto> {
    const existReport = await this.reportRepository.findOneBy(reportId);

    return existReport ? new ReportDto(existReport) : null;
  }

  async delete(reportId: number): Promise<UpdateResult> {
    const existReport = await this.findOneOrNotFound(reportId);

    const updateResult = await this.reportRepository.delete(existReport.id);

    if (!updateResult.affected) {
      throw new InternalServerErrorException(
        '신고 삭제 중 알 수 없는 서버에러 발생',
      );
    }

    return updateResult;
  }
}
