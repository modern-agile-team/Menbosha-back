import { Module } from '@nestjs/common';
import { MentorReviewsModule } from '@src/mentors/mentor-reviews/mentor-reviews.module';
import { MentorsController } from './controllers/mentors.controller';
import { MentorsService } from './services/mentors.service';
import { CategoryModule } from '@src/category/category.module';
import { MentorRepository } from './repositories/mentor.repository';
import { QueryBuilderHelper } from '@src/helpers/query-builder.helper';

@Module({
  imports: [MentorReviewsModule, CategoryModule],
  controllers: [MentorsController],
  providers: [MentorsService, MentorRepository, QueryBuilderHelper],
})
export class MentorsModule {}
