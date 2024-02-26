import { Module } from '@nestjs/common';
import { UserModule } from '@src/users/user.module';
import { BannedUserModule } from '@src/admins/banned-user/banned-users.module';
import { AdminsController } from '@src/admins/controllers/admins.controller';
import { AdminsService } from '@src/admins/services/admins.service';
import { ReportsModule } from '@src/reports/reports.module';

@Module({
  imports: [UserModule, BannedUserModule, ReportsModule],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
