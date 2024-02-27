import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponseDto } from '@src/common/dto/pagination-response.dto';
import { ReportsItemDto } from '@src/reports/dto/reports-item.dto';

export class ReportsPaginationResponseDto extends PaginationResponseDto {
  @ApiProperty({
    description: '리포트 item',
    type: [ReportsItemDto],
  })
  reportsItemDto: ReportsItemDto[];

  constructor(
    reportsItemDto: ReportsItemDto[],
    totalCount: number,
    page: number,
    pageSize: number,
  ) {
    super(totalCount, page, pageSize);

    this.reportsItemDto = reportsItemDto;
  }
}
