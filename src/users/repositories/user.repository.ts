import { Injectable, NotFoundException } from '@nestjs/common';
import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  UpdateResult,
} from 'typeorm';
import { User } from '../entities/user.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Provider } from 'src/auth/enums/provider.enum';

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

  async updateUserName(userId: number, name: string): Promise<User> {
    const user = await this.entityManager.findOne(User, {
      where: { id: userId },
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
}
