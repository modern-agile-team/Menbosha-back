import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserBadge } from '../entities/user-badge.entity';

@Injectable()
export class UserBadgeRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async getUserBadge(userId: number) {
    return await this.entityManager.find(UserBadge, { where: { userId } });
  }

  async findUserBadges(userId: number) {
    return await this.entityManager.find(UserBadge, {
      where: { userId }, // 해당 userId에 해당하는 뱃지만 가져오도록 필터링
    });
  }

  // async checkUserBadge(userId: number) {}
}
