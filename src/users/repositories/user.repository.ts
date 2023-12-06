import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, EntityManager } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async getUserInfo(userId: number): Promise<User> {
    const user = await this.entityManager.findOne(User, {
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
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
}
