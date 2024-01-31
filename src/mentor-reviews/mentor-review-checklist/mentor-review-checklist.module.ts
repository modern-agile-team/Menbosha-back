import { Module } from '@nestjs/common';
import { MentorReviewChecklistService } from './services/mentor-review-checklist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorReviewChecklist } from './entities/mentor-review-checklist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MentorReviewChecklist])],
  controllers: [],
  providers: [MentorReviewChecklistService],
  exports: [MentorReviewChecklistService],
})
export class MentorReviewChecklistModule {}
