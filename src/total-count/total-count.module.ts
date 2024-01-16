import { Module, forwardRef } from '@nestjs/common';
import { TotalCountRepository } from './repositories/total-count.repository';
import { TotalCountService } from './services/total-count.service';
import { TotalCountController } from './controllers/total-count.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [TotalCountController],
  providers: [TotalCountRepository, TotalCountService],
  exports: [TotalCountRepository, TotalCountService],
})
export class TotalCountModule {}
