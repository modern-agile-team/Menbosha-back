import { Module } from '@nestjs/common';
import { MentorsController } from './controllers/mentors.controller';
import { MentorsService } from './services/mentors.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorReview } from 'src/users/entities/mentor-review.entity';
import { MentorReviewChecklist } from 'src/users/entities/mentor-review-checklist.entity';
import { MentorsRepository } from './repositories/mentors.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MentorReview, MentorReviewChecklist])],
  controllers: [MentorsController],
  providers: [MentorsService, MentorsRepository],
})
export class MentorsModule {}
