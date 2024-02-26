import { Module, forwardRef } from '@nestjs/common';
import { BannedUserRepository } from '@src/admins/banned-user/repositories/banned-user.repository';
import { BannedUsersService } from '@src/admins/banned-user/services/banned-users.service';
import { QueryHelper } from '@src/helpers/query.helper';
import { UserModule } from '@src/users/user.module';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [BannedUsersService, BannedUserRepository, QueryHelper],
  exports: [BannedUsersService],
})
export class BannedUserModule {}
