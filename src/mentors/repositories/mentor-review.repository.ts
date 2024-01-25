import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  DataSource,
  FindOneOptions,
  Like,
  Repository,
  UpdateResult,
} from 'typeorm';
import { CreateMentorReviewChecklistRequestBodyDto } from '../dtos/create-mentor-review-checklist-request-body.dto';
import { MentorReviewChecklist } from '../mentor-review-checklist/entities/mentor-review-checklist.entity';
import { MentorReview } from '../entities/mentor-review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MentorReviewOrderField } from '../constants/mentor-review-order-field.enum';
import { SortOrder } from 'src/common/constants/sort-order.enum';
import { MentorReviewsItemResponseDto } from '../dtos/mentor-reviews-item-response.dto';
import { CustomRepository } from 'src/config/type-orm/decorators/custom-repository.decorator';

@CustomRepository(MentorReview)
export class MentorReviewRepository extends Repository<MentorReview> {
  findMentorReviews(
    skip: number,
    pageSize: number,
    id: number,
    menteeId: number,
    mentorId: number,
    review: string,
    orderField: MentorReviewOrderField,
    sortOrder: SortOrder,
  ): Promise<[MentorReviewsItemResponseDto[], number]> {
    return this.findAndCount({
      select: {
        id: true,
        mentee: {
          id: true,
          name: true,
          rank: true,
          userImage: {
            imageUrl: true,
          },
          userIntro: {
            customCategory: true,
            career: true,
            shortIntro: true,
          },
        },
        mentorReviewChecklist: {
          id: true,
          mentorReviewId: true,
          isGoodWork: true,
          isClear: true,
          isQuick: true,
          isAccurate: true,
          isKindness: true,
          isFun: true,
          isInformative: true,
          isBad: true,
          isStuffy: true,
        },
        review: true,
        createdAt: true,
      },
      where: {
        mentorId,
        ...(id ? { id } : {}),
        ...(menteeId ? { menteeId } : {}),
        ...(review ? { review: Like(review) } : {}),
      },
      relations: {
        mentee: {
          userImage: true,
          userIntro: true,
        },
        mentorReviewChecklist: true,
      },
      order: {
        [orderField]: sortOrder,
      },
      skip,
      take: pageSize,
    });
  }
  async patchUpdateAllMentorReview(
    mentorId: number,
    menteeId: number,
    reviewId: number,
    patchMentorReviewChecklistRequestBodyDto: CreateMentorReviewChecklistRequestBodyDto,
    review: string,
  ): Promise<{
    mentorReviewUpdateResult: UpdateResult;
    mentorReviewChecklistUpdateResult: UpdateResult;
  }> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const mentorReviewUpdateResult = await entityManager
        .withRepository(this)
        .update(
          {
            id: reviewId,
            mentorId,
            menteeId,
          },
          {
            review,
          },
        );

      const mentorReviewChecklistUpdateResult = await entityManager
        .withRepository(this.mentorReviewChecklistRepository)
        .update(
          {
            mentorReviewId: reviewId,
          },
          {
            ...patchMentorReviewChecklistRequestBodyDto,
          },
        );

      await queryRunner.commitTransaction();

      return { mentorReviewUpdateResult, mentorReviewChecklistUpdateResult };
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      console.error(error);

      throw new InternalServerErrorException(
        '멘토 리뷰 업데이트 중 알 수 없는 서버에러 발생',
      );
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }

  patchUpdateOptionalMentorReview(
    mentorId: number,
    menteeId: number,
    reviewId: number,
    patchMentorReviewChecklistRequestBodyDto: CreateMentorReviewChecklistRequestBodyDto,
    review: string,
  ): Promise<UpdateResult> {
    return review
      ? this.mentorReviewRepository.update(
          {
            id: reviewId,
            mentorId,
            menteeId,
          },
          {
            review,
          },
        )
      : this.mentorReviewChecklistRepository.update(
          {
            mentorReviewId: reviewId,
          },
          {
            ...patchMentorReviewChecklistRequestBodyDto,
          },
        );
  }
}
