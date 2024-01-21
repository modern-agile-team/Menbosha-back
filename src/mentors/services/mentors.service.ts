import { Injectable } from '@nestjs/common';
import { MentorsRepository } from '../repositories/mentors.repository';
import { CreateMentorReviewRequestBodyDto } from '../dtos/create-mentor-review-request-body.dto';
import { MentorReviewDto } from '../dtos/mentor-review.dto';
import { MentorReviewChecklistDto } from '../dtos/mentor-review-checklist.dto';
import { MentorBoardPageQueryDto } from '../dtos/mentor-review-page-query-dto';
import { MentorReviewsItemResponseDto } from '../dtos/mentor-reviews-item-response.dto';
import { plainToInstance } from 'class-transformer';
import { MentorReviewsPaginationResponseDto } from '../dtos/mentor-reviews-pagination-response.dto';

@Injectable()
export class MentorsService {
  constructor(private readonly mentorsRepository: MentorsRepository) {}
  async createMentorReview(
    mentorId: number,
    menteeId: number,
    createMentorReviewRequestBodyDto: CreateMentorReviewRequestBodyDto,
  ): Promise<MentorReviewDto> {
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
      mentorReviewChecklistsDto: new MentorReviewChecklistDto(
        mentorReviewChecklist,
      ),
    });
  }
  async findMentorReviews(
    mentorId: number,
    mentorBoardPageQueryDto: MentorBoardPageQueryDto,
  ) {
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
}
