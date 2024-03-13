import { Injectable } from '@nestjs/common';
import { Badge } from '@src/entities/Badge';
import { UserBadge } from '@src/entities/UserBadge';
import { EntityManager } from 'typeorm';

@Injectable()
export class UserBadgeRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async getUserBadges(userId: number) {
    return await this.entityManager.find(UserBadge, { where: { userId } });
  }

  async findUserBadges(userId: number) {
    return await this.entityManager.find(UserBadge, {
      where: { userId },
    });
  }

  async getBadges() {
    return await this.entityManager.find(Badge);
  }

  async createNewBadges(newBadges: UserBadge[]): Promise<UserBadge[]> {
    return await this.entityManager.save(UserBadge, newBadges);
  }
}
