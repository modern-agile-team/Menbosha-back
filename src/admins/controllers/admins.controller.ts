import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BannedUsersService } from 'src/admins/banned-user/services/banned-users.service';
import { OnlyAdmin } from 'src/admins/decorators/only-admin.decorator';
import { CreateBannedUserBodyDto } from 'src/admins/dtos/create-banned-user-body.dto';
import { AdminHandlerGuard } from 'src/admins/guards/admin-handler.guard';
import { AccessTokenAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { SuccessResponseInterceptor } from 'src/common/interceptors/success-response.interceptor';
import { ApiCreateBannedUser } from 'src/admins/swagger-decorators/create-banned-user.decorator';
import { BannedUserDto } from 'src/admins/banned-user/dtos/banned-user.dto';
import { PutUpdateUserForAdminDto } from 'src/admins/dtos/put-update-user-for-admin.dto';

@ApiTags('_admin')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@UseInterceptors(ClassSerializerInterceptor, SuccessResponseInterceptor)
@Controller('admins')
export class AdminsController {
  constructor(private readonly bannedUsersService: BannedUsersService) {}

  @ApiCreateBannedUser()
  @Post('users/:userId/banned-users')
  @OnlyAdmin(true)
  @UseGuards(AccessTokenAuthGuard, AdminHandlerGuard)
  createBannedUser(
    @Body() createBannedUserBodyDto: CreateBannedUserBodyDto,
    @Param('userId') userId: number,
    @GetUserId() adminId: number,
  ): Promise<BannedUserDto> {
    return this.bannedUsersService.createBannedUser(
      adminId,
      userId,
      createBannedUserBodyDto,
    );
  }

  @Put('users/:userId')
  @OnlyAdmin(true)
  @UseGuards(AccessTokenAuthGuard, AdminHandlerGuard)
  putUserUpdateStatus(
    @Body() putUpdateUserForAdminDto: PutUpdateUserForAdminDto,
    @Param('userId') userId: number,
    @GetUserId() adminId: number,
  ) {}
}
