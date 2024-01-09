import { Injectable } from '@nestjs/common';
import { EntityManager, MoreThan } from 'typeorm';
import { User } from '../entities/user.entity';
import { MentorBoard } from 'src/boards/entities/mentor-board.entity';
import { HelpYouComment } from 'src/comments/entities/help-you-comment.entity';
import { UserReview } from '../entities/user-review.entity';
import { UserBadge } from '../entities/user-badge.entity';

@Injectable()
export class UserRankingRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async getAllUserId() {
    const users = await this.entityManager.find(User, { select: ['id'] });

    return users.map((user) => user.id);
  }

  async countMentorBoard(userId: number) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return await this.entityManager.count(MentorBoard, {
      where: { userId, createdAt: MoreThan(thirtyDaysAgo) },
    });
  }

  async countHelpYouComment(userId: number) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return await this.entityManager.count(HelpYouComment, {
      where: { userId, createdAt: MoreThan(thirtyDaysAgo) },
    });
  }

  async checkBoardLikeNum(userId: number) {
    // const thirtyDaysAgo = new Date();
    // thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    // return await this.entityManager.count(mentorboardlike, {
    //   where: { id: userId, createdAt: MoreThan(thirtyDaysAgo) },
    // });
  }

  async countUserReview(userId: number) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return await this.entityManager.count(UserReview, {
      where: { mentorId: userId }, // , createdAt: MoreThan(thirtyDaysAgo) },
    });
  }

  async getUserRank(userId: number) {
    const user = await this.entityManager.findOne(User, {
      where: { id: userId },
      select: ['rank'],
    });

    return user.rank;
  }

  async countBadge(userId: number) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return await this.entityManager.count(UserBadge, {
      where: { userId, createdAt: MoreThan(thirtyDaysAgo) },
    });
  }
}
