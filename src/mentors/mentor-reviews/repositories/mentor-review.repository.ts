import { EntityManager, FindOneOptions, Like, UpdateResult } from 'typeorm';
import { MentorReview } from '../entities/mentor-review.entity';
import { MentorReviewOrderField } from '../constants/mentor-review-order-field.enum';
import { SortOrder } from 'src/common/constants/sort-order.enum';
import { Injectable } from '@nestjs/common';
import { MentorReviewsItemResponseDto } from '../dtos/mentor-reviews-item-response.dto';

@Injectable()
export class MentorReviewRepository {
  constructor(private readonly entityManager: EntityManager) {}
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
    return this.entityManager.getRepository(MentorReview).findAndCount({
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
        review: true,
        isGoodWork: true,
        isClear: true,
        isQuick: true,
        isAccurate: true,
        isKindness: true,
        isFun: true,
        isInformative: true,
        isBad: true,
        isStuffy: true,
        createdAt: true,
      },
      where: {
        mentorId,
        ...(id ? { id } : {}),
        ...(menteeId ? { menteeId } : {}),
        ...(review ? { review: Like(`%${review}%`) } : {}),
      },
      relations: {
        mentee: {
          userImage: true,
          userIntro: true,
        },
      },
      order: {
        [orderField]: sortOrder,
      },
      skip,
      take: pageSize,
    });
  }

  findOne(options: FindOneOptions<MentorReview>) {
    return this.entityManager.getRepository(MentorReview).findOne(options);
  }

  updateMentorReview(
    reviewId: number,
    mentorId: number,
    menteeId: number,
    mentorReview: MentorReview,
  ): Promise<UpdateResult> {
    return this.entityManager
      .getRepository(MentorReview)
      .update({ id: reviewId, mentorId, menteeId }, { ...mentorReview });
  }
}
