import { Module } from '@nestjs/common';
import { MentorsController } from './controllers/mentors.controller';
import { MentorsService } from './services/mentors.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorReview } from 'src/mentors/entities/mentor-review.entity';
import { MentorReviewChecklist } from 'src/mentors/entities/mentor-review-checklist.entity';
import { MentorsRepository } from './repositories/mentors.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/users/user.module';
import { MentorReviewCountRepository } from './repositories/mentor-review-count.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MentorReview, MentorReviewChecklist]),
    AuthModule,
    UserModule,
  ],
  controllers: [MentorsController],
  providers: [MentorsService, MentorsRepository, MentorReviewCountRepository],
})
export class MentorsModule {}
