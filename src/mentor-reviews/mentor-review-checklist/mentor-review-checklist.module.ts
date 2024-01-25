import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/config/type-orm/type-orm-ex.module';
import { MentorReviewChecklistRepository } from './repositories/mentor-review-checklists.repository';
import { MentorReviewChecklistService } from './services/mentor-review-checklist.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([MentorReviewChecklistRepository]),
  ],
  controllers: [],
  providers: [MentorReviewChecklistService],
  exports: [MentorReviewChecklistService],
})
export class MentorReviewChecklistModule {}
