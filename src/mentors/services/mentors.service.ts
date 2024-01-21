import { Injectable, NotFoundException } from '@nestjs/common';
import { MentorsRepository } from '../repositories/mentors.repository';
import { CreateMentorReviewRequestBodyDto } from '../dtos/create-mentor-review-request-body.dto';
import { MentorReviewDto } from '../dtos/mentor-review.dto';
import { MentorReviewChecklistDto } from '../dtos/mentor-review-checklist.dto';
import { MentorBoardPageQueryDto } from '../dtos/mentor-review-page-query-dto';
import { MentorReviewsItemResponseDto } from '../dtos/mentor-reviews-item-response.dto';
import { plainToInstance } from 'class-transformer';
import { MentorReviewsPaginationResponseDto } from '../dtos/mentor-reviews-pagination-response.dto';
import { UserService } from 'src/users/services/user.service';
import { FindOneOptions } from 'typeorm';
import { MentorReview } from '../entities/mentor-review.entity';

@Injectable()
export class MentorsService {
  constructor(
    private readonly mentorsRepository: MentorsRepository,
    private readonly userService: UserService,
  ) {}
  async createMentorReview(
    mentorId: number,
    menteeId: number,
    createMentorReviewRequestBodyDto: CreateMentorReviewRequestBodyDto,
  ): Promise<MentorReviewDto> {
    await this.userService.findOneByOrNotFound(mentorId);

    const { review, createMentorReviewChecklistRequestBodyDto } =
      createMentorReviewRequestBodyDto;

    const { mentorReview, mentorReviewChecklist } =
      await this.mentorsRepository.createMentorReview(
        mentorId,
        menteeId,
        { ...createMentorReviewChecklistRequestBodyDto },
        review,
      );

    return new MentorReviewDto({
      ...mentorReview,
      mentorReviewChecklist: new MentorReviewChecklistDto(
        mentorReviewChecklist,
      ),
    });
  }

  async findMentorReviews(
    mentorId: number,
    mentorBoardPageQueryDto: MentorBoardPageQueryDto,
  ): Promise<MentorReviewsPaginationResponseDto> {
    await this.userService.findOneByOrNotFound(mentorId);

    const { page, pageSize, id, menteeId, review, orderField, sortOrder } =
      mentorBoardPageQueryDto;

    const skip = (page - 1) * pageSize;

    const [mentorReviews, count] =
      await this.mentorsRepository.findMentorReviews(
        skip,
        pageSize,
        id,
        menteeId,
        mentorId,
        review,
        orderField,
        sortOrder,
      );

    const mentorReviewsItemResponseDto = plainToInstance(
      MentorReviewsItemResponseDto,
      mentorReviews,
    );

    return new MentorReviewsPaginationResponseDto(
      mentorReviewsItemResponseDto,
      count,
      page,
      pageSize,
    );
  }

  async findOneMentorReviewOrFail(
    options: FindOneOptions<MentorReview>,
  ): Promise<MentorReview> {
    const existReview =
      await this.mentorsRepository.findOneMentorReview(options);

    if (!existReview) {
      throw new NotFoundException('해당 멘토에 대한 리뷰를 찾을 수 없습니다.');
    }

    return existReview;
  }

  async findOneMentorReview(
    mentorId: number,
    reviewId: number,
  ): Promise<MentorReviewDto> {
    await this.userService.findOneByOrNotFound(mentorId);

    const existReview = await this.findOneMentorReviewOrFail({
      where: {
        id: reviewId,
        mentorId,
      },
      relations: {
        mentorReviewChecklist: true,
      },
    });

    return new MentorReviewDto(existReview);
  }
}
