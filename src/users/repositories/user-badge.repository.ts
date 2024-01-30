import { Injectable } from '@nestjs/common';
import { EntityManager, In } from 'typeorm';
import { UserBadge } from '../entities/user-badge.entity';

@Injectable()
export class UserBadgeRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async getUserBadge(userId: number) {
    return await this.entityManager.find(UserBadge, { where: { userId } });
  }

  async myBoardBadge(userId: number, boardBadges: number[]) {
    return await this.entityManager.find(UserBadge, {
      where: { userId, badgeId: In(boardBadges) },
    });
  }

  // async checkUserBadge(userId: number) {}
}
