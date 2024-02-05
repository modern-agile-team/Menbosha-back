import { Injectable } from '@nestjs/common';
import { CategoryService } from 'src/category/services/category.service';
import { MentorListPageQueryDto } from 'src/users/dtos/mentor-list-page-query.dto';
import { MentorRepository } from '../repositories/mentor.repository';

@Injectable()
export class MentorsService {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly mentorRepository: MentorRepository,
  ) {}

  async findAllMentorsAndCount(mentorListPageQueryDto: MentorListPageQueryDto) {
    const { page, pageSize, orderField, sortOrder, ...filter } =
      mentorListPageQueryDto;

    const category = await this.categoryService.findOneCategoryOrNotFound(
      filter.activityCategoryId,
    );

    filter.activityCategoryId = category.id;

    const skip = (page - 1) * pageSize;

    return await this.mentorRepository.findAllMentorsAndCount(
      skip,
      pageSize,
      orderField,
      sortOrder,
      filter,
    );
  }
}
