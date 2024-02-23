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
import { BannedUsersService } from 'src/admins/banned-user/services/banned-users.service';
import { OnlyAdmin } from 'src/admins/decorators/only-admin.decorator';
import { CreateBannedUserBodyDto } from 'src/admins/dtos/create-banned-user-body.dto';
import { AdminHandlerGuard } from 'src/admins/guards/admin-handler.guard';
import { AccessTokenAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { SuccessResponseInterceptor } from 'src/common/interceptors/success-response.interceptor';

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

  @Post('users/:userId/banned-users')
  @OnlyAdmin(true)
  @UseGuards(AccessTokenAuthGuard, AdminHandlerGuard)
  createBannedUser(
    @Body() createBannedUserBodyDto: CreateBannedUserBodyDto,
    @Param('userId') userId: number,
    @GetUserId() myId: number,
  ) {
    return this.bannedUsersService.createBannedUser(
      myId,
      userId,
      createBannedUserBodyDto,
    );
  }
}
