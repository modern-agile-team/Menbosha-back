import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortOrder } from '@src/common/constants/sort-order.enum';
import { IsPositiveInt } from '@src/common/decorators/validators/is-positive-int.decorator';
import { PageQueryDto } from '@src/common/dto/page-query.dto';
import { ReportOrderField } from '@src/reports/constants/report-order-field.enum';
import { ReportType } from '@src/reports/constants/report-type.enum';
import { REPORT_REASON_LENGTH } from '@src/reports/constants/report.constant';
import { IsOptional, IsString, Length, IsEnum } from 'class-validator';

export class ReportPageQueryDto extends PageQueryDto {
  @ApiPropertyOptional({
    description: '리포트 고유 ID 필터링',
    format: 'integer',
  })
  @IsOptional()
  @IsPositiveInt()
  id?: number;

  @ApiPropertyOptional({
    description: '신고한 유저 고유 ID 필터링',
    format: 'integer',
  })
  @IsOptional()
  @IsPositiveInt()
  reportUserId?: number;

  @ApiPropertyOptional({
    description: '신고 당한 유저 고유 ID 필터링',
    format: 'integer',
  })
  @IsOptional()
  @IsPositiveInt()
  reportedUserId?: number;

  @ApiPropertyOptional({
    description: '신고 타입',
    enum: ReportType,
  })
  @IsOptional()
  @IsEnum(ReportType)
  type?: ReportType;

  @ApiPropertyOptional({
    description: '신고 사유 필터링',
    minLength: REPORT_REASON_LENGTH.MIN,
    maxLength: REPORT_REASON_LENGTH.MAX,
  })
  @IsOptional()
  @IsString()
  @Length(REPORT_REASON_LENGTH.MIN, REPORT_REASON_LENGTH.MAX)
  reason?: string;

  @ApiPropertyOptional({
    description: '리포트 정렬 필드',
    default: ReportOrderField.Id,
    enum: ReportOrderField,
  })
  @IsOptional()
  @IsEnum(ReportOrderField)
  orderField: ReportOrderField = ReportOrderField.Id;

  @ApiPropertyOptional({
    description: '오름차순 혹은 내림차순',
    default: SortOrder.ASC,
    enum: SortOrder,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.ASC;
}
