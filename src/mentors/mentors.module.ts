import { Module } from '@nestjs/common';
import { MentorsController } from './controllers/mentors.controller';
import { MentorsService } from './services/mentors.service';
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
  controllers: [MentorsController],
  providers: [MentorsService],
})
export class MentorsModule {}
