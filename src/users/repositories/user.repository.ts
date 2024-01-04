import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, EntityManager, FindManyOptions } from 'typeorm';
import { User } from '../entities/user.entity';

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

  async findUser(email: string, provider: string): Promise<User | undefined> {
    return this.entityManager.findOne(User, { where: { email, provider } });
  }

  async createUser(userInfo: any): Promise<User> {
    const user = new User();
    user.provider = userInfo.provider;
    user.name = userInfo.nickname;
    user.email = userInfo.email;
    user.hopeCategoryId = 3;
    user.activityCategoryId = 3;
    user.isMentor = false;

    return this.entityManager.save(user);
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

  async deleteUser(userId: number): Promise<DeleteResult | undefined> {
    await this.entityManager.findOne(User, { where: { id: userId } });
    return await this.entityManager.delete(User, { id: userId });
  }

  async findPageByMentors(skip: number, limit: number): Promise<User[]> {
    return await this.entityManager.find(User, {
      relations: ['userImage', 'userIntro'],
      skip: skip,
      take: limit,
    });
  }

  async findIsMentors(): Promise<number> {
    return await this.entityManager.count(User, {
      where: { isMentor: true },
    });
  }
}
