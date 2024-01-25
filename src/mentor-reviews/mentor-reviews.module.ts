import { Module } from '@nestjs/common';
import { MentorReviewsController } from './controllers/mentor-reviews.controller';
import { MentorReviewsService } from './services/mentor-reviews.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/users/user.module';
import { TypeOrmExModule } from 'src/config/type-orm/type-orm-ex.module';
import { MentorReviewRepository } from './repositories/mentor-review.repository';
import { MentorReviewChecklistModule } from './mentor-review-checklist/mentor-review-checklist.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([MentorReviewRepository]),
    AuthModule,
    UserModule,
    MentorReviewChecklistModule,
  ],
  controllers: [MentorReviewsController],
  providers: [MentorReviewsService],
})
export class MentorReviewsModule {}
