import { Module } from '@nestjs/common';
import { MentorReviewsModule } from 'src/mentors/mentor-reviews/mentor-reviews.module';
import { MentorsController } from './controllers/mentors.controller';
import { MentorsService } from './services/mentors.service';

@Module({
  imports: [MentorReviewsModule],
  controllers: [MentorsController],
  providers: [MentorsService],
})
export class MentorsModule {}
