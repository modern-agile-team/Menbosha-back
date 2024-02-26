import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BannedUserDto } from '@src/admins/banned-user/dtos/banned-user.dto';
import { BannedUsersPaginationResponseDto } from '@src/admins/banned-user/dtos/banned-users-pagination-response.dto';
import { BannedUsersService } from '@src/admins/banned-user/services/banned-users.service';
import { Roles } from '@src/admins/decorators/roles.decorator';
import { BannedUserPageQueryDto } from '@src/admins/banned-user/dtos/banned-user-page-query.dto';
import { CreateBannedUserBodyDto } from '@src/admins/banned-user/dtos/create-banned-user-body.dto';
import { PutUpdateUserForAdminDto } from '@src/admins/dtos/put-update-user-for-admin.dto';
import { ReportPageQueryDto } from '@src/reports/dto/report-page-query-dto';
import { UserResponseForAdminDto } from '@src/admins/dtos/user-response-for-admin.dto';
import { RoleClassGuard } from '@src/admins/guards/role-class.guard';
import { AdminsService } from '@src/admins/services/admins.service';
import { ApiCreateBannedUser } from '@src/admins/swagger-decorators/create-banned-user.decorator';
import { ApiFindAllBannedUsers } from '@src/admins/swagger-decorators/find-all-banned-users.decorator';
import { ApiFindOneBannedUser } from '@src/admins/swagger-decorators/find-one-banned-user.decorator';
import { ApiPutUpdateUserStatus } from '@src/admins/swagger-decorators/put-update-user-status.decorator';
import { AccessTokenAuthGuard } from '@src/auth/jwt/jwt-auth.guard';
import { GetUserId } from '@src/common/decorators/get-userId.decorator';
import { SuccessResponseInterceptor } from '@src/common/interceptors/success-response.interceptor';
import { ReportsService } from '@src/reports/services/reports.service';
import { UserRole } from '@src/users/constants/user-role.enum';
import { ApiFindAllReports } from '@src/admins/swagger-decorators/find-all-reports.decorator';
import { ParsePositiveIntPipe } from '@src/common/pipes/parse-positive-int.pipe';
import { ReportDto } from '@src/reports/dto/report.dto';
import { ApiFindOneReport } from '@src/admins/swagger-decorators/find-one-report-decorator';

@ApiTags('_admin')
@UsePipes(
  new ValidationPipe({
    forbidNonWhitelisted: true,
    transform: true,
    whitelist: true,
  }),
)
@UseGuards(AccessTokenAuthGuard, RoleClassGuard)
@Roles(UserRole.ADMIN)
@UseInterceptors(ClassSerializerInterceptor, SuccessResponseInterceptor)
@Controller('admins')
export class AdminsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly bannedUsersService: BannedUsersService,
    private readonly adminsService: AdminsService,
  ) {}

  @ApiCreateBannedUser()
  @Post('users/:userId/banned-users')
  createBannedUser(
    @Body() createBannedUserBodyDto: CreateBannedUserBodyDto,
    @Param('userId', ParsePositiveIntPipe) userId: number,
    @GetUserId() adminId: number,
  ): Promise<BannedUserDto> {
    return this.bannedUsersService.create(
      adminId,
      userId,
      createBannedUserBodyDto,
    );
  }

  @ApiFindAllBannedUsers()
  @Get('banned-users')
  findAllBannedUsers(
    @Query() bannedUserPageQueryDto: BannedUserPageQueryDto,
  ): Promise<BannedUsersPaginationResponseDto> {
    return this.bannedUsersService.findAll(bannedUserPageQueryDto);
  }

  @ApiFindOneBannedUser()
  @Get('banned-users/:id')
  findOneBannedUser(
    @Param('id', ParsePositiveIntPipe) id: number,
  ): Promise<BannedUserDto> {
    return this.bannedUsersService.findOneOrNotFound(id);
  }

  @ApiFindAllReports()
  @Get('reports')
  findAllReports(@Query() reportPageQueryDto: ReportPageQueryDto) {
    return this.reportsService.findAll(reportPageQueryDto);
  }

  @ApiFindOneReport()
  @Get('reports/:reportId')
  findOneReport(
    @Param('reportId', ParsePositiveIntPipe) reportId: number,
  ): Promise<ReportDto> {
    return this.reportsService.findOneOrNotFound(reportId);
  }

  @ApiPutUpdateUserStatus()
  @Put('users/:userId')
  putUpdateUserStatus(
    @Body() putUpdateUserForAdminDto: PutUpdateUserForAdminDto,
    @Param('userId', ParsePositiveIntPipe) userId: number,
    @GetUserId() adminId: number,
  ): Promise<UserResponseForAdminDto> {
    return this.adminsService.putUpdateUserStatus(
      adminId,
      userId,
      putUpdateUserForAdminDto,
    );
  }
}
