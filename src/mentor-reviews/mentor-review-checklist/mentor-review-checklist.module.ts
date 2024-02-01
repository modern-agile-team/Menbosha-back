import { Module } from '@nestjs/common';
import { MentorReviewChecklistService } from './services/mentor-review-checklist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorReviewChecklist } from './entities/mentor-review-checklist.entity';
import { MentorReviewChecklistRepository } from './repositories/mentor-review-checklists.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MentorReviewChecklist])],
  controllers: [],
  providers: [MentorReviewChecklistService, MentorReviewChecklistRepository],
  exports: [MentorReviewChecklistService, MentorReviewChecklistRepository],
})
export class MentorReviewChecklistModule {}
