import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '@src/auth/auth.module';
import { MentorReviewChecklistCountRepository } from '@src/total-count/repositories/mentor-review-checklist-count.repository';
import { TotalCountRepository } from '@src/total-count/repositories/total-count.repository';
import { MentorReviewChecklistCountsService } from '@src/total-count/services/mentor-review-checklist-counts.service';
import { TotalCountService } from '@src/total-count/services/total-count.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [],
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
