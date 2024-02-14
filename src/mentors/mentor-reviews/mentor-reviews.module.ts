import { Module } from '@nestjs/common';
import { MentorReviewsController } from './controllers/mentor-reviews.controller';
import { MentorReviewsService } from './services/mentor-reviews.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorReview } from './entities/mentor-review.entity';
import { MentorReviewRepository } from './repositories/mentor-review.repository';
import { MentorReviewChecklistCount } from 'src/total-count/entities/mentor-review-checklist-count.entity';
import { TotalCountModule } from 'src/total-count/total-count.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MentorReview, MentorReviewChecklistCount]),
    AuthModule,
    UserModule,
    TotalCountModule,
  ],
  controllers: [MentorReviewsController],
  providers: [MentorReviewsService, MentorReviewRepository],
})
export class MentorReviewsModule {}
