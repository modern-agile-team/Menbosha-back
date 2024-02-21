import { Injectable, NotFoundException } from '@nestjs/common';
import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  UpdateResult,
} from 'typeorm';
import { User } from '../entities/user.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

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

  findUser(email: string, provider: string): Promise<User | undefined> {
    return this.entityManager.findOne(User, { where: { email, provider } });
  }

  createUser(entityManager: EntityManager, userInfo: any): Promise<User> {
    const { provider, nickname: name, email } = userInfo;
    return entityManager.save(User, {
      provider,
      name,
      email,
      hopeCategoryId: 1,
      activityCategoryId: 1,
      isMentor: false,
    });
  }

  async updateUserName(userId: number, name: string): Promise<User> {
    const user = await this.entityManager.findOne(User, {
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    user.name = name;

    return this.entityManager.save(user);
  }

  updateUser(
    userId: number,
    partialEntity: QueryDeepPartialEntity<User>,
  ): Promise<UpdateResult> {
    return this.entityManager.update(User, { id: userId }, partialEntity);
  }

  findCategoryIdByIsMentors(categoryId: number): Promise<number> {
    return this.entityManager.count(User, {
      where: { isMentor: true, activityCategoryId: categoryId },
    });
  }

  findIsMentors(): Promise<number> {
    return this.entityManager.count(User, {
      where: { isMentor: true },
    });
  }

  findOne(options: FindOneOptions<User>) {
    return this.entityManager.findOne(User, options);
  }
}
