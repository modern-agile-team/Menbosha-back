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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BannedUserDto } from '@src/admins/banned-user/dtos/banned-user.dto';
import { BannedUsersService } from '@src/admins/banned-user/services/banned-users.service';
import { Roles } from '@src/admins/decorators/roles.decorator';
import { BannedUserPageQueryDto } from '@src/admins/dtos/banned-user-page-query.dto';
import { CreateBannedUserBodyDto } from '@src/admins/dtos/create-banned-user-body.dto';
import { PutUpdateUserForAdminDto } from '@src/admins/dtos/put-update-user-for-admin.dto';
import { RoleClassGuard } from '@src/admins/guards/role-class.guard';
import { AdminsService } from '@src/admins/services/admins.service';
import { ApiCreateBannedUser } from '@src/admins/swagger-decorators/create-banned-user.decorator';
import { ApiPutUpdateUserStatus } from '@src/admins/swagger-decorators/put-update-user-status.decorator';
import { AccessTokenAuthGuard } from '@src/auth/jwt/jwt-auth.guard';
import { GetUserId } from '@src/common/decorators/get-userId.decorator';
import { SuccessResponseInterceptor } from '@src/common/interceptors/success-response.interceptor';
import { UserRole } from '@src/users/constants/user-role.enum';

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
    private readonly bannedUsersService: BannedUsersService,
    private readonly adminsService: AdminsService,
  ) {}

  @ApiCreateBannedUser()
  @Post('users/:userId/banned-users')
  createBannedUser(
    @Body() createBannedUserBodyDto: CreateBannedUserBodyDto,
    @Param('userId') userId: number,
    @GetUserId() adminId: number,
  ): Promise<BannedUserDto> {
    return this.bannedUsersService.create(
      adminId,
      userId,
      createBannedUserBodyDto,
    );
  }

  @ApiBearerAuth('access-token')
  @Get('banned-users')
  findAllBannedUsers(@Query() bannedUserPageQueryDto: BannedUserPageQueryDto) {
    return this.bannedUsersService.findAll(bannedUserPageQueryDto);
  }

  @ApiPutUpdateUserStatus()
  @Put('users/:userId')
  putUpdateUserStatus(
    @Body() putUpdateUserForAdminDto: PutUpdateUserForAdminDto,
    @Param('userId') userId: number,
    @GetUserId() adminId: number,
  ) {
    return this.adminsService.putUpdateUserStatus(
      adminId,
      userId,
      putUpdateUserForAdminDto,
    );
  }
}
