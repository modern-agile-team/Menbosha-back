import { Injectable } from '@nestjs/common';
import { EntityManager, MoreThanOrEqual } from 'typeorm';
import { TotalCount } from '@src/total-count/entities/total-count.entity';
import { UserImage } from '@src/users/entities/user-image.entity';
import { UserIntro } from '@src/users/entities/user-intro.entity';
import { UserRanking } from '@src/users/entities/user-ranking.entity';
import { User } from '@src/users/entities/user.entity';

@Injectable()
export class UserRankingRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async getUserRanking() {
    return await this.entityManager
      .createQueryBuilder(UserRanking, 'userRanking')
      .leftJoin(User, 'user', 'user.id = userRanking.userId')
      .leftJoin(UserImage, 'userImage', 'user.id = userImage.userId')
      .leftJoin(TotalCount, 'totalCount', 'user.id = totalCount.userId')
      .select([
        'userRanking.userId as userId',
        'userRanking.name as `name`',
        'userRanking.rank as `rank`',
        'userRanking.shortIntro as shortIntro',
        'userRanking.customCategory as customCategory',
        'userRanking.career as career',
        'userRanking.activityCategoryId as activityCategoryId',
        'userImage.imageUrl as imageUrl',
        'totalCount.reviewCount as reviewCount',
        'totalCount.mentorBoardCount as mentorBoardCount',
      ])
      .distinct(true)
      .take(10)
      .getRawMany();
  }

  async allUserCounts() {
    const allCounts = await this.entityManager.find(TotalCount, {
      select: [
        'userId',
        'mentorBoardCountInSevenDays',
        'mentorBoardLikeCountInSevenDays',
        'helpYouCommentCountInSevenDays',
        'badgeCountInSevenDays',
        'reviewCountInSevenDays',
      ],
      where: [
        { mentorBoardCountInSevenDays: MoreThanOrEqual(2) },
        { helpYouCommentCountInSevenDays: MoreThanOrEqual(3) },
        { mentorBoardLikeCountInSevenDays: MoreThanOrEqual(6) },
        { reviewCountInSevenDays: MoreThanOrEqual(1) },
      ],
    });

    return allCounts;
  }

  async saveUserRanking(userIds: Array<number | null>) {
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
      select: ['reviewCount'],
    });

    const userIntro = await this.entityManager.findOne(UserIntro, {
      where: { userId },
      select: ['shortIntro', 'career', 'customCategory'],
    });

    return await this.entityManager
      .createQueryBuilder()
      .update(UserRanking)
      .set({
        activityCategoryId: user.activityCategoryId,
        name: user.name,
        rank: user.rank,
        reviewCount: totalCount.reviewCount,
        customCategory: userIntro.customCategory,
        career: userIntro.career,
        shortIntro: userIntro.shortIntro,
      })
      .where('userId = :userId', { userId })
      .execute();
  }

  async findUserIdsByUserRanking() {
    return await this.entityManager
      .createQueryBuilder(UserRanking, 'userRanking')
      .select('userRanking.userId')
      .orderBy('userRanking.rank', 'DESC')
      .getMany();
  }

  async clearUserRanking() {
    return await this.entityManager
      .createQueryBuilder()
      .delete()
      .from(UserRanking)
      .execute();
  }
}
