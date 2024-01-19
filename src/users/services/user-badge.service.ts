import { Injectable } from '@nestjs/common';
import { UserBadgeRepository } from '../repositories/user-badge.repository';
import { TotalCountRepository } from 'src/total-count/repositories/total-count.repository';

@Injectable()
export class UserBadgeService {
  constructor(
    private readonly userBadgeRepository: UserBadgeRepository,
    private readonly totalCountRepository: TotalCountRepository,
  ) {}

  async userBadge(userId: number) {
    return await this.userBadgeRepository.getUserBadge(userId);
  }
}
