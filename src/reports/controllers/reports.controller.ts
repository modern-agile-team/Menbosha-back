import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenAuthGuard } from '@src/auth/jwt/jwt-auth.guard';
import { GetUserId } from '@src/common/decorators/get-userId.decorator';
import { SuccessResponseInterceptor } from '@src/common/interceptors/success-response.interceptor';
import { ParsePositiveIntPipe } from '@src/common/pipes/parse-positive-int.pipe';
import { CreateReportBodyDto } from '@src/reports/dto/create-report-body.dto';
import { ReportDto } from '@src/reports/dto/report.dto';
import { ReportsService } from '@src/reports/services/reports.service';
import { ApiCreateReportDecorator } from '@src/reports/swagger-decorators/create-report.decorator';

@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@UseInterceptors(ClassSerializerInterceptor, SuccessResponseInterceptor)
@ApiTags('report')
@Controller('users/:userId/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(AccessTokenAuthGuard)
  @ApiCreateReportDecorator()
  create(
    @Body() createReportBodyDto: CreateReportBodyDto,
    @Param('userId', ParsePositiveIntPipe) userId: number,
    @GetUserId() myId: number,
  ): Promise<ReportDto> {
    return this.reportsService.create(createReportBodyDto, myId, userId);
  }
}
