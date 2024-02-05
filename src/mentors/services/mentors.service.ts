import { Injectable } from '@nestjs/common';
import { CategoryService } from 'src/category/services/category.service';
import { MentorListPageQueryDto } from 'src/users/dtos/mentor-list-page-query.dto';
import { MentorRepository } from '../repositories/mentor.repository';
import { UserWithImageAndIntroDto } from '../dtos/user-with-image-and-intro.dto';
import { MentorPaginationResponseDto } from '../dtos/mentors-pagination-response.dto';

@Injectable()
export class MentorsService {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly mentorRepository: MentorRepository,
  ) {}

  async findAllMentorsAndCount(
    mentorListPageQueryDto: MentorListPageQueryDto,
  ): Promise<MentorPaginationResponseDto> {
    const { page, pageSize, orderField, sortOrder, ...filter } =
      mentorListPageQueryDto;

    console.log(orderField);

    const category = await this.categoryService.findOneCategoryOrNotFound(
      filter.activityCategoryId,
    );

    filter.activityCategoryId = category.id;

    const skip = (page - 1) * pageSize;

    const [totalCount, mentors] =
      await this.mentorRepository.findAllMentorsAndCount(
        skip,
        pageSize,
        orderField,
        sortOrder,
        filter,
      );

    const userWithImageAndIntroDtos = mentors.map(
      (mentor) => new UserWithImageAndIntroDto(mentor),
    );

    return new MentorPaginationResponseDto(
      userWithImageAndIntroDtos,
      totalCount,
      page,
      pageSize,
    );
  }
}
