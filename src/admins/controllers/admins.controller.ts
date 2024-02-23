import {
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
import { OnlyAdmin } from 'src/admins/decorators/only-admin.decorator';
import { AdminHandlerGuard } from 'src/admins/guards/admin-handler.guard';
import { AdminsService } from 'src/admins/services/admins.service';
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
  constructor(private readonly adminsService: AdminsService) {}

  @Post('users/:userId/banned-users')
  @OnlyAdmin(true)
  @UseGuards(AccessTokenAuthGuard, AdminHandlerGuard)
  createBannedUser(@Param('userId') userId: number, @GetUserId() myId: number) {
    return 'say hello admin';
  }
}
