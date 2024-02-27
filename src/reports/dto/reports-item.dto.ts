import { OmitType } from '@nestjs/swagger';
import { ReportDto } from '@src/reports/dto/report.dto';

export class ReportsItemDto extends OmitType(ReportDto, ['reason']) {}
