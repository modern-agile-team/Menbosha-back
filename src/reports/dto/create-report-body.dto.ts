import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, Length } from 'class-validator';
import { UserReportType } from '@src/reports/constants/report-type.enum';
import { REPORT_REASON_LENGTH } from '@src/reports/constants/report.constant';
import { ReportDto } from '@src/reports/dto/report.dto';

export class CreateReportBodyDto implements Pick<ReportDto, 'type' | 'reason'> {
  @ApiProperty({
    description: '신고 타입',
    enum: UserReportType,
  })
  @IsEnum(UserReportType)
  type: UserReportType;

  @ApiProperty({
    description: '신고 사유',
    minLength: REPORT_REASON_LENGTH.MIN,
    maxLength: REPORT_REASON_LENGTH.MAX,
  })
  @Length(REPORT_REASON_LENGTH.MIN, REPORT_REASON_LENGTH.MAX)
  reason: string;
}
