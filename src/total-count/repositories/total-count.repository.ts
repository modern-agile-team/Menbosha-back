import { Injectable } from '@nestjs/common';
import { MentorBoard } from 'src/boards/entities/mentor-board.entity';
import { HelpYouComment } from 'src/comments/entities/help-you-comment.entity';
import { UserReview } from 'src/users/entities/user-review.entity';
import { EntityManager } from 'typeorm';
import { TotalCount } from '../entities/total-count.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TotalCountRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async createTotalCount(userId: number) {
    await this.entityManager.insert('total_count', { userId });
  }

  async counting(
    userId: number,
    type: string,
    action: 'increment' | 'decrement',
  ) {
    if (action === 'increment') {
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

  async syncTotalCount(
    userId: number,
    mentorBoardCount: number,
    helpYouCommentCount: number,
    mentorBoardLikeCount: number,
    badgeCount: number,
    reviewCount: number,
  ) {
    return await this.entityManager.update(
      TotalCount,
      { userId },
      {
        countMentorBoard: mentorBoardCount,
        countHelpYouComment: helpYouCommentCount,
        countMentorBoardLike: mentorBoardLikeCount,
        countBadge: badgeCount,
        countReview: reviewCount,
      },
    );
  }

  async getAllUserId() {
    const users = await this.entityManager.find(User, { select: ['id'] });

    return users.map((user) => user.id);
  }

  async getMentorBoardCount(userId: number) {
    return await this.entityManager.countBy(MentorBoard, { userId });
  }

  async getHelpYouCommentCount(userId: number) {
    return await this.entityManager.countBy(HelpYouComment, { userId });
  }

  async getMentorBoardLikeCount(userId: number) {
    // return await this.entityManager.countBy(MentorBoardLike, { userId });
  }

  async getbadgeCount(userId: number) {
    return await this.entityManager.countBy(MentorBoard, { userId });
  }

  async getReviewCount(userId: number) {
    return await this.entityManager.countBy(UserReview, { mentorId: userId });
  }
}
