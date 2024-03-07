import { Module } from '@nestjs/common';
import { MentorReviewsModule } from '@src/mentors/mentor-reviews/mentor-reviews.module';
import { CategoryModule } from '@src/category/category.module';
import { QueryBuilderHelper } from '@src/helpers/query-builder.helper';
import { MentorsController } from '@src/mentors/controllers/mentors.controller';
import { MentorRepository } from '@src/mentors/repositories/mentor.repository';
import { MentorsService } from '@src/mentors/services/mentors.service';

@Module({
  imports: [MentorReviewsModule, CategoryModule],
  controllers: [MentorsController],
  providers: [MentorsService, MentorRepository, QueryBuilderHelper],
})
export class MentorsModule {}
