import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { TotalCount } from '../entities/total-count.entity';
import { Type } from '../enums/type.enum';
import { Action } from '../enums/action.enum';

@Injectable()
export class TotalCountRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async createTotalCount(userId: number) {
    await this.entityManager.insert('total_count', { userId });
  }

  async createMentorReviewChecklistCount(userId: number) {
    await this.entityManager.insert('mentor_review_checklist_count', {
      userId,
    });
  }

  async counting(userId: number, type: Type, action: Action) {
    if (action === Action.Increment) {
      await this.entityManager.increment(TotalCount, { userId }, type, 1);
      await this.entityManager.increment(
        TotalCount,
        { userId },
        `${type}InSevenDays`,
        1,
      );
    } else {
      await this.entityManager.decrement(TotalCount, { userId }, type, 1);
      await this.entityManager.decrement(
        TotalCount,
        { userId },
        `${type}InSevenDays`,
        1,
      );
    }
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
