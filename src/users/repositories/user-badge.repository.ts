import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserBadge } from '../entities/user-badge.entity';

@Injectable()
export class UserBadgeRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async findUserBadges(userId: number) {
    return await this.entityManager.find(UserBadge, { where: { userId } });
  }

  // async checkUserBadge(userId: number) {}
}
