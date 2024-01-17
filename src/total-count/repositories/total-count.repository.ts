import { Injectable } from '@nestjs/common';
import { MentorBoard } from 'src/boards/entities/mentor-board.entity';
import { HelpYouComment } from 'src/comments/entities/help-you-comment.entity';
import { UserReview } from 'src/users/entities/user-review.entity';
import { EntityManager } from 'typeorm';
import { TotalCount } from '../entities/total-count.entity';
import { User } from 'src/users/entities/user.entity';
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
        countMentorBoard7days: 0,
        countHelpYouComment7days: 0,
        countMentorBoardLike7days: 0,
        countBadge7days: 0,
        countReview7days: 0,
      },
    );
  }
}
