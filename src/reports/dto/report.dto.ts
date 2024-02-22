import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserReportType } from 'src/reports/constants/report-type.enum';
import { REPORT_REASON_LENGTH } from 'src/reports/constants/report.constant';
import { Report } from 'src/reports/entities/report.entity';

export class ReportDto implements Omit<Report, 'reportUser' | 'reportedUser'> {
  @ApiProperty({
    description: '신고 고유 ID',
    format: 'integer',
    minimum: 1,
  })
  id: number;

  @ApiProperty({
    description: '신고한 유저 고유 ID',
    format: 'integer',
    minimum: 1,
  })
  reportUserId: number;

  @ApiProperty({
    description: '신고 당한 유저 고유 ID',
    format: 'integer',
    minimum: 1,
  })
  reportedUserId: number;

  @ApiProperty({
    description: '신고 사유',
    minLength: REPORT_REASON_LENGTH.MIN,
    maxLength: REPORT_REASON_LENGTH.MAX,
  })
  reason: string;

  @ApiProperty({
    description: '신고 타입',
    enum: UserReportType,
  })
  type: UserReportType;

  @ApiProperty({
    description: '생성 일자',
    format: 'timestamp',
  })
  createdAt: Date;

  @Exclude()
  deletedAt: Date | null;

  constructor(reportDto: ReportDto) {
    Object.assign(this, reportDto);
  }
}
