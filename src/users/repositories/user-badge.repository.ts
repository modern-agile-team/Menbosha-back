import { Injectable } from '@nestjs/common';
import { EntityManager, In } from 'typeorm';
import { UserBadge } from '../entities/user-badge.entity';

@Injectable()
export class UserBadgeRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async getUserBadge(userId: number) {
    console.log(userId);

    return await this.entityManager.find(UserBadge, { where: { userId } });
  }

  async addMentorBoardBadge(userId: number, badgeId: number) {
    const newBadge = await this.entityManager.create(UserBadge, {
      userId: userId,
      badgeId: badgeId,
    });
    await this.entityManager.save(UserBadge, newBadge);
    return newBadge;
  }

  async myMentorBoardBadge(userId: number, boardBadges: number[]) {
    return await this.entityManager.find(UserBadge, {
      where: { userId, badgeId: In(boardBadges) },
    });
  }

  async myCommentBadge(userId: number, commentBadges: number[]) {
    return await this.entityManager.find(UserBadge, {
      where: { userId, badgeId: In(commentBadges) },
    });
  }

  async myLikeBadge(userId: number, likeBadges: number[]) {
    return await this.entityManager.find(UserBadge, {
      where: { userId, badgeId: In(likeBadges) },
    });
  }

  async myReviewBadge(userId: number, reviewBadges: number[]) {
    return await this.entityManager.find(UserBadge, {
      where: { userId, badgeId: In(reviewBadges) },
    });
  }

  // async checkUserBadge(userId: number) {}
}
