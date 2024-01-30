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

  // 이부분들 리펙토링 기간에 다시 손봐야함 - 간결하게 정리하기.
  async countBoards(userId: number) {
    const totalCount = await this.entityManager.findOne(TotalCount, {
      where: { userId },
    });
    return totalCount ? totalCount.mentorBoardCount : 0;
  }

  async countComments(userId: number) {
    const totalCount = await this.entityManager.findOne(TotalCount, {
      where: { userId },
    });
    return totalCount ? totalCount.helpYouCommentCount : 0;
  }

  async countLikes(userId: number) {
    const totalCount = await this.entityManager.findOne(TotalCount, {
      where: { userId },
    });
    return totalCount ? totalCount.mentorBoardLikeCount : 0;
  }

  async countReviews(userId: number) {
    const totalCount = await this.entityManager.findOne(TotalCount, {
      where: { userId },
    });
    return totalCount ? totalCount.reviewCount : 0;
  }
}
