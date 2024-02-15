import { Module, forwardRef } from '@nestjs/common';
import { TotalCountRepository } from './repositories/total-count.repository';
import { TotalCountService } from './services/total-count.service';
import { TotalCountController } from './controllers/total-count.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MentorReviewChecklistCountsService } from './services/mentor-review-checklist-counts.service';
import { MentorReviewChecklistCountRepository } from './repositories/mentor-review-checklist-count.repository';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [TotalCountController],
  providers: [
    TotalCountRepository,
    TotalCountService,
    MentorReviewChecklistCountsService,
    MentorReviewChecklistCountRepository,
  ],
  exports: [
    TotalCountRepository,
    TotalCountService,
    MentorReviewChecklistCountsService,
  ],
})
export class TotalCountModule {}
