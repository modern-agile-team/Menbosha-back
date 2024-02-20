import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { TotalCount } from '../entities/total-count.entity';

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
