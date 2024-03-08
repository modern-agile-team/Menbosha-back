import { EntityManager, FindOneOptions, UpdateResult } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { MentorReviewsItemResponseDto } from '@src/mentors/mentor-reviews/dtos/mentor-reviews-item-response.dto';
import { MentorReview } from '@src/entities/MentorReview';

@Injectable()
export class MentorReviewRepository {
  constructor(private readonly entityManager: EntityManager) {}

  createMentorReviewWithEntityManager(
    entityManager: EntityManager,
    mentorId: number,
    menteeId: number,
    mentorReview: MentorReview,
  ) {
    return entityManager.getRepository(MentorReview).save({
      mentorId,
      menteeId,
      ...mentorReview,
    });
  }

  findMentorReviews(
    skip: number,
    pageSize: number,
    where: Record<string, any>,
    order: Record<string, any>,
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
        isUnderstandWell: true,
        createdAt: true,
        updatedAt: true,
      },
      where,
      relations: {
        mentee: {
          userImage: true,
          userIntro: true,
        },
      },
      order,
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

  updateMentorReviewWithEntityManager(
    entityManager: EntityManager,
    reviewId: number,
    mentorId: number,
    menteeId: number,
    mentorReview: MentorReview,
  ): Promise<UpdateResult> {
    return entityManager
      .getRepository(MentorReview)
      .update({ id: reviewId, mentorId, menteeId }, { ...mentorReview });
  }
}
