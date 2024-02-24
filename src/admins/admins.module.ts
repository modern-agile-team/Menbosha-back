import { Module } from '@nestjs/common';
import { UserModule } from '@src/users/user.module';
import { BannedUserModule } from '@src/admins/banned-user/banned-users.module';
import { AdminsController } from '@src/admins/controllers/admins.controller';
import { AdminsService } from '@src/admins/services/admins.service';

@Module({
  imports: [UserModule, BannedUserModule],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
