import { Injectable } from '@nestjs/common';
import { EntityManager, MoreThanOrEqual } from 'typeorm';
import { User } from '../entities/user.entity';
import { TotalCount } from 'src/total-count/entities/total-count.entity';
import { UserRanking } from '../entities/user-ranking.entity';
import { UserIntro } from '../entities/user-intro.entity';

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

  async saveUserRanking(userIds: Array<any>) {
    return await this.entityManager
      .createQueryBuilder()
      .insert()
      .into(UserRanking)
      .values(userIds.map((userId) => ({ userId })))
      .execute();
  }

  async saveUserInfo(userId: number) {
    const user = await this.entityManager.findOne(User, {
      where: { id: userId },
      select: ['activityCategoryId', 'name', 'rank'],
    });

    const totalCount = await this.entityManager.findOne(TotalCount, {
      where: { userId },
      select: ['countReview'],
    });

    const userIntro = await this.entityManager.findOne(UserIntro, {
      where: { userId },
      select: ['mainField', 'career', 'introduce'],
    });

    await this.entityManager
      .createQueryBuilder()
      .update(UserRanking)
      .set({
        activityCategoryId: user.activityCategoryId,
        name: user.name,
        rank: user.rank,
        countReview: totalCount.countReview,
        mainField: userIntro.mainField,
        career: userIntro.career,
        introduce: userIntro.introduce,
      })
      .where('userId = :userId', { userId })
      .execute();
  }
}
