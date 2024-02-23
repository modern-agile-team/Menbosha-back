import { Module } from '@nestjs/common';
import { BannedUserRepository } from 'src/admins/banned-user/repositories/banned-user.repository';
import { BannedUsersService } from 'src/admins/banned-user/services/banned-users.service';

@Module({
  providers: [BannedUsersService, BannedUserRepository],
  exports: [BannedUsersService],
})
export class BannedUserModule {}
