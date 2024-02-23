import { Module } from '@nestjs/common';
import { AdminsController } from './controllers/admins.controller';
import { AdminsService } from './services/admins.service';
import { UserModule } from 'src/users/user.module';
import { BannedUserModule } from 'src/admins/banned-user/banned-users.module';

@Module({
  imports: [UserModule, BannedUserModule],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
