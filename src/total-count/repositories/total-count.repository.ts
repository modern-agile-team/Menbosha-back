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

  async counting(userId: number, type: Type, action: Action) {
    if (action === Action.Increment) {
      await this.entityManager.increment(TotalCount, { userId }, type, 1);
      await this.entityManager.increment(
        TotalCount,
        { userId },
        `${type}7days`,
        1,
      );
    } else {
      await this.entityManager.decrement(TotalCount, { userId }, type, 1);
      await this.entityManager.decrement(
        TotalCount,
        { userId },
        `${type}7days`,
        1,
      );
    }
  }

  async clear7DaysCount() {
    return await this.entityManager.update(
      TotalCount,
      {},
      {
        mentorBoardCount7days: 0,
        helpYouCommentCount7days: 0,
        mentorBoardLikeCount7days: 0,
        badgeCount7days: 0,
        reviewCount7days: 0,
      },
    );
  }

  async countBoards(userId: number) {
    return await this.entityManager.countBy(TotalCount, { userId });
  }

  async countComments(userId: number) {
    return await this.entityManager.countBy(TotalCount, { userId });
  }

  async countLikes(userId: number) {
    return await this.entityManager.countBy(TotalCount, { userId });
  }
}
