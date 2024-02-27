import { Injectable } from '@nestjs/common';
import { CreateUserIntroDto } from '@src/users/dtos/create-user-intro-dto';
import { UpdateUserIntroDTO } from '@src/users/dtos/update-user-intro-dto';
import { UserIntro } from '@src/users/entities/user-intro.entity';
import { User } from '@src/users/entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class UserIntroRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async getUserIntro(userId: number) {
    return await this.entityManager.find(UserIntro, { where: { userId } });
  }

  async createUserIntro(
    userId: number,
    userData: CreateUserIntroDto,
  ): Promise<UserIntro> {
    const userIntro = new UserIntro();
    userIntro.shortIntro = userData.shortIntro;
    userIntro.career = userData.career;
    userIntro.customCategory = userData.customCategory;
    userIntro.detail = userData.detail;
    userIntro.portfolio = userData.portfolio;
    userIntro.sns = userData.sns;
    userIntro.userId = userId;
    return await this.entityManager.save(UserIntro, userIntro);
  }

  async getOneUserIntro(mentorId: number): Promise<UserIntro> {
    const userIntro = await this.entityManager.findOne(UserIntro, {
      where: { userId: mentorId },
    });
    return userIntro;
  }

  async findUserIntro(userId: number): Promise<UserIntro> {
    return await this.entityManager.findOne(UserIntro, { where: { userId } });
  }

  async updateUserIntro(
    userData: Partial<UpdateUserIntroDTO>,
  ): Promise<UserIntro> {
    return await this.entityManager.save(UserIntro, userData);
  }

  async updateUser(userId: number, userData: Partial<UpdateUserIntroDTO>) {
    return await this.entityManager.update(User, userId, userData);
  }
}
