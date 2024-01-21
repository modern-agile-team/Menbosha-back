import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MentorsRepository } from '../repositories/mentors.repository';
import { CreateMentorReviewRequestBodyDto } from '../dtos/create-mentor-review-request-body.dto';
import { MentorReviewDto } from '../dtos/mentor-review.dto';
import { MentorBoardPageQueryDto } from '../dtos/mentor-review-page-query-dto';
import { MentorReviewsItemResponseDto } from '../dtos/mentor-reviews-item-response.dto';
import { plainToInstance } from 'class-transformer';
import { MentorReviewsPaginationResponseDto } from '../dtos/mentor-reviews-pagination-response.dto';
import { UserService } from 'src/users/services/user.service';
import { FindOneOptions } from 'typeorm';
import { MentorReview } from '../entities/mentor-review.entity';
import { PatchUpdateMentorReviewDto } from '../dtos/patch-update-mentor-review.dto';
import { isNotEmptyObject } from 'class-validator';

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
    await this.userService.findOneByOrNotFound({
      select: {
        id: true,
      },
      where: {
        id: mentorId,
        isMentor: true,
      },
    });

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
      mentorReviewChecklist,
    });
  }

  async findMentorReviews(
    mentorId: number,
    mentorBoardPageQueryDto: MentorBoardPageQueryDto,
  ): Promise<MentorReviewsPaginationResponseDto> {
    await this.userService.findOneByOrNotFound({
      select: {
        id: true,
      },
      where: {
        id: mentorId,
        isMentor: true,
      },
    });

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

  /**
   * TypeORM은 soft delete 기능을 지원.
   * 1. deletedAt 칼럼에 DeleteDateColumn 데코레이터를 달고, softDelete 메서드를 쓰거나 날짜를 직접 new Date()하면 알아서 걸러줌.
   * 2. 날짜를 직접 new Date()로 추가, where 조건에 deletedAt: IsNull()
   */
  async findOneMentorReviewOrFail(
    mentorId: number,
    options: FindOneOptions<MentorReview>,
  ): Promise<MentorReview> {
    await this.userService.findOneByOrNotFound({
      select: {
        id: true,
      },
      where: {
        id: mentorId,
        isMentor: true,
      },
    });

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
    const existReview = await this.findOneMentorReviewOrFail(mentorId, {
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

  async patchUpdateMentorReview(
    mentorId: number,
    menteeId: number,
    reviewId: number,
    patchUpdateMentorReviewDto: PatchUpdateMentorReviewDto,
  ): Promise<MentorReviewDto> {
    const { mentorReviewChecklist, review } = patchUpdateMentorReviewDto;

    if (!isNotEmptyObject(patchUpdateMentorReviewDto)) {
      throw new BadRequestException('At least one update field must exist.');
    }

    const existReview = await this.findOneMentorReviewOrFail(mentorId, {
      where: {
        mentorId,
        id: reviewId,
      },
      relations: {
        mentorReviewChecklist: true,
      },
    });

    if (existReview.menteeId !== menteeId) {
      throw new ForbiddenException('해당 리뷰에 권한이 없습니다.');
    }

    mentorReviewChecklist && review
      ? await this.mentorsRepository.patchUpdateAllMentorReview(
          existReview.mentorId,
          existReview.menteeId,
          existReview.id,
          mentorReviewChecklist,
          review,
        )
      : await this.mentorsRepository.patchUpdateOptionalMentorReview(
          existReview.mentorId,
          existReview.menteeId,
          existReview.id,
          mentorReviewChecklist,
          review,
        );

    const updatedMentorReviewChecklist = Object.assign(
      existReview.mentorReviewChecklist,
      mentorReviewChecklist,
    );

    const updatedMentorReview = Object.assign(
      existReview,
      patchUpdateMentorReviewDto,
    );

    return new MentorReviewDto({
      ...updatedMentorReview,
      mentorReviewChecklist: updatedMentorReviewChecklist,
    });
  }

  async removeMentorReview(
    mentorId: number,
    menteeId: number,
    reviewId: number,
  ): Promise<void> {
    const existReview = await this.findOneMentorReviewOrFail(mentorId, {
      select: ['id', 'menteeId', 'mentorId'],
      where: {
        mentorId,
        id: reviewId,
      },
    });

    if (existReview.menteeId !== menteeId) {
      throw new ForbiddenException('해당 리뷰에 권한이 없습니다.');
    }

    await this.mentorsRepository.removeMentorReview(
      existReview.id,
      existReview.mentorId,
      existReview.menteeId,
    );
  }
}
