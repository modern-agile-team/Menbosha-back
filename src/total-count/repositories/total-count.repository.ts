import { Injectable } from '@nestjs/common';
import { MentorReviewChecklistCount } from '@src/entities/MentorReviewChecklistCount';
import { TotalCount } from '@src/entities/TotalCount';
import { EntityManager } from 'typeorm';

@Injectable()
export class TotalCountRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async createTotalCount(entityManager: EntityManager, userId: number) {
    await entityManager.insert(TotalCount, { userId });
  }

  async createMentorReviewChecklistCount(
    entityManager: EntityManager,
    mentorId: number,
  ) {
    await entityManager.insert(MentorReviewChecklistCount, {
      mentorId,
    });
  }

  getMentorBoardAndReviewCount(userId: number) {
    return this.entityManager.findOne(TotalCount, {
      where: { userId },
      select: ['mentorBoardCount', 'reviewCount'],
    });
  }

  async clear7DaysCount() {
    return await this.entityManager.update(
      TotalCount,
      {},
      {
        mentorBoardCountInSevenDays: 0,
        helpYouCommentCountInSevenDays: 0,
        mentorBoardLikeCountInSevenDays: 0,
        badgeCountInSevenDays: 0,
        reviewCountInSevenDays: 0,
      },
    );
  }

  getMentorBoardAndReviewAndBadgeCount(userId: number) {
    return this.entityManager.findOne(TotalCount, {
      where: { userId },
      select: ['mentorBoardCount', 'reviewCount', 'badgeCount'],
    });
  }
}
