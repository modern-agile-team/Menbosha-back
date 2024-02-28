import { Injectable, NotFoundException } from '@nestjs/common';
import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Provider } from '@src/auth/enums/provider.enum';
import { UserInfo } from '@src/auth/interfaces/user-info.interface';
import { User } from '@src/users/entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly entityManager: EntityManager) {}

  findAll(options: FindManyOptions<User>) {
    return this.entityManager.getRepository(User).find(options);
  }

  async getUserInfo(userId: number): Promise<User> {
    const user = await this.entityManager.findOne(User, {
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  async getUserRank(userId: number): Promise<number> {
    return (
      await this.entityManager.findOne(User, {
        where: { id: userId },
        select: ['rank'],
      })
    ).rank;
  }

  findUser(email: string, provider: Provider): Promise<User | null> {
    return this.entityManager.findOne(User, { where: { email, provider } });
  }

  createUser(entityManager: EntityManager, userInfo: UserInfo): Promise<User> {
    return entityManager.save(User, {
      ...userInfo,
      hopeCategoryId: 1,
      activityCategoryId: 1,
      isMentor: false,
    });
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
      .leftJoin(
        'user.banned',
        'banned',
        'banned.id = (SELECT id FROM banned_user WHERE banned_user_id = user.id ORDER BY id DESC LIMIT 1)',
      )
      .select([
        'user.id',
        'user.role',
        'user.status',
        'banned.id',
        'banned.endAt',
      ])
      .where('user.id = :userId', { userId })
      .getOne();
  }
}
