import { Injectable } from '@nestjs/common';
import { TotalCount } from '@src/total-count/entities/total-count.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class TotalCountRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async createTotalCount(entityManager: EntityManager, userId: number) {
    await entityManager.insert('total_count', { userId });
  }

  async createMentorReviewChecklistCount(
    entityManager: EntityManager,
    userId: number,
  ) {
    await entityManager.insert('mentor_review_checklist_count', {
      userId,
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
}
