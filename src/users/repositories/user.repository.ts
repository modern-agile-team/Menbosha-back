import { Injectable } from '@nestjs/common';
import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UserProvider } from '@src/auth/enums/user-provider.enum';
import { UserInfo } from '@src/auth/interfaces/user-info.interface';
import { User } from '@src/entities/User';

@Injectable()
export class UserRepository {
  constructor(private readonly entityManager: EntityManager) {}

  findAll(options: FindManyOptions<User>) {
    return this.entityManager.getRepository(User).find(options);
  }

  getUser(userId: number): Promise<User> {
    return this.entityManager.findOne(User, {
      where: { id: userId },
    });
  }

  getUserInfo(userId: number) {
    return this.entityManager
      .getRepository(User)
      .createQueryBuilder('user')
      .leftJoin('user.userImage', 'userImage')
      .leftJoin('user.userIntro', 'userIntro')
      .leftJoin('user.userBadges', 'userBadges')
      .leftJoin('user.totalCount', 'totalCount')
      .select([
        'user.id',
        'user.name',
        'user.rank',
        'user.phone',
        'user.hopeCategoryId',
        'user.activityCategoryId',
        'user.createdAt',
        'user.updatedAt',
        'user.isMentor',
        'userBadges.badgeId',
        'userBadges.createdAt',
        'userImage.imageUrl',
        'userIntro.shortIntro',
        'userIntro.career',
        'userIntro.customCategory',
        'userIntro.detail',
        'userIntro.portfolio',
        'userIntro.sns',
        'totalCount.mentorBoardCount',
        'totalCount.reviewCount',
      ])
      .where('user.id = :userId', { userId })
      .getOne();
  }

  async getUserRank(userId: number): Promise<number> {
    return (
      await this.entityManager.findOne(User, {
        where: { id: userId },
        select: ['rank'],
      })
    ).rank;
  }

  findUser(uniqueId: string, provider: UserProvider): Promise<User | null> {
    return this.entityManager.findOne(User, { where: { uniqueId, provider } });
  }

  createUser(entityManager: EntityManager, userInfo: UserInfo): Promise<User> {
    return entityManager.save(User, { ...userInfo });
  }

  updateUser(
    userId: number,
    partialEntity: QueryDeepPartialEntity<User>,
  ): Promise<UpdateResult> {
    return this.entityManager.update(User, { id: userId }, partialEntity);
  }

  countMentorsInCategory(categoryId: number): Promise<number> {
    return this.entityManager.count(User, {
      where: { isMentor: true, activityCategoryId: categoryId },
    });
  }

  countMentors(): Promise<number> {
    return this.entityManager.count(User, {
      where: { isMentor: true },
    });
  }

  findOne(options: FindOneOptions<User>) {
    return this.entityManager.findOne(User, options);
  }

  findOneByQueryBuilder(userId: number): Promise<User> {
    return this.entityManager
      .getRepository(User)
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.role',
        'user.status',
        'banned.id',
        'banned.endAt',
      ])
      .leftJoin(
        'user.banned',
        'banned',
        'banned.id = (SELECT id FROM banned_user WHERE banned_user_id = user.id ORDER BY id DESC LIMIT 1)',
      )
      .where('user.id = :userId', { userId })
      .getOne();
  }

  findOneAndSelectAllByQueryBuilder(email: string, provider: UserProvider) {
    return this.entityManager
      .getRepository(User)
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.provider',
        'user.name',
        'user.email',
        'user.rank',
        'user.phone',
        'user.hopeCategoryId',
        'user.activityCategoryId',
        'user.status',
        'user.deletedAt',
        'user.createdAt',
        'user.updatedAt',
        'user.uniqueId',
        'user.isMentor',
        'user.role',
        'banned.id',
        'banned.reason',
        'banned.bannedUserId',
        'banned.bannedAt',
        'banned.endAt',
      ])
      .leftJoin(
        'user.banned',
        'banned',
        'banned.id = (SELECT id FROM banned_user WHERE banned_user_id = user.id ORDER BY id DESC LIMIT 1)',
      )
      .setFindOptions({
        where: {
          email,
          provider,
        },
      })
      .withDeleted()
      .getOne();
  }

  async updateMyRank(userId: number, rank: number): Promise<void> {
    const user = await this.getUser(userId);
    user.rank = rank;
    user.id = userId;
    await this.entityManager.save(User, user);
  }
}
