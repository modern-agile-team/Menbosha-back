import { Module } from '@nestjs/common';
import { MentorReviewsModule } from 'src/mentor-reviews/mentor-reviews.module';

@Module({
  imports: [MentorReviewsModule],
  controllers: [],
})
export class MentorsModule {}
