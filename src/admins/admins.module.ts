import { Module } from '@nestjs/common';
import { AdminsController } from './controllers/admins.controller';
import { AdminsService } from './services/admins.service';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [UserModule],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
