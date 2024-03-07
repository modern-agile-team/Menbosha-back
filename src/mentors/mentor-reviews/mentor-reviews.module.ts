import { Module } from '@nestjs/common';
import { AuthModule } from '@src/auth/auth.module';
import { UserModule } from '@src/users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorReviewChecklistCount } from '@src/total-count/entities/mentor-review-checklist-count.entity';
import { TotalCountModule } from '@src/total-count/total-count.module';
import { MentorReviewsController } from '@src/mentors/mentor-reviews/controllers/mentor-reviews.controller';
import { MentorReview } from '@src/mentors/mentor-reviews/entities/mentor-review.entity';
import { MentorReviewRepository } from '@src/mentors/mentor-reviews/repositories/mentor-review.repository';
import { MentorReviewsService } from '@src/mentors/mentor-reviews/services/mentor-reviews.service';
import { QueryHelper } from '@src/helpers/query.helper';

@Module({
  imports: [
    TypeOrmModule.forFeature([MentorReview, MentorReviewChecklistCount]),
    AuthModule,
    UserModule,
    TotalCountModule,
  ],
  controllers: [MentorReviewsController],
  providers: [MentorReviewsService, MentorReviewRepository, QueryHelper],
})
export class MentorReviewsModule {}
