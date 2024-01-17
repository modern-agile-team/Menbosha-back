import { Injectable } from '@nestjs/common';
import { EntityManager, MoreThanOrEqual } from 'typeorm';
import { User } from '../entities/user.entity';
import { TotalCount } from 'src/total-count/entities/total-count.entity';

@Injectable()
export class UserRankingRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async getAllUserId() {
    const users = await this.entityManager.find(User, { select: ['id'] });

    return users.map((user) => user.id);
  }

  async allUserCounts() {
    const allCounts = await this.entityManager.find(TotalCount, {
      select: [
        'userId',
        'countMentorBoard7days',
        'countMentorBoardLike7days',
        'countHelpYouComment7days',
        'countBadge7days',
        'countReview7days',
      ],
      where: [
        { countMentorBoard7days: MoreThanOrEqual(2) },
        { countHelpYouComment7days: MoreThanOrEqual(3) },
        { countMentorBoardLike7days: MoreThanOrEqual(6) },
        { countReview7days: MoreThanOrEqual(1) },
      ],
    });

    return allCounts;
  }
}
