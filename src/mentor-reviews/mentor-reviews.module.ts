import { Module } from '@nestjs/common';
import { MentorReviewsController } from './controllers/mentor-reviews.controller';
import { MentorReviewsService } from './services/mentor-reviews.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/users/user.module';
import { MentorReviewChecklistModule } from './mentor-review-checklist/mentor-review-checklist.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorReview } from './entities/mentor-review.entity';
import { MentorReviewRepository } from './repositories/mentor-review.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MentorReview]),
    AuthModule,
    UserModule,
    MentorReviewChecklistModule,
  ],
  controllers: [MentorReviewsController],
  providers: [MentorReviewsService, MentorReviewRepository],
})
export class MentorReviewsModule {}
