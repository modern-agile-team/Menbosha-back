import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserBadge } from '../entities/user-badge.entity';
import { BadgeList } from '@src/common/entity/badge-list.entity';

@Injectable()
export class UserBadgeRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async getUserBadge(userId: number) {
    return await this.entityManager.find(UserBadge, { where: { userId } });
  }

  async findUserBadges(userId: number) {
    return await this.entityManager.find(UserBadge, {
      where: { userId },
    });
  }

  async getBadgeList() {
    return await this.entityManager.find(BadgeList);
  }

  async createNewBadges(newBadges: UserBadge[]): Promise<UserBadge[]> {
    return await this.entityManager.save(UserBadge, newBadges);
  }
}
