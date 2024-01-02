import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateUserIntroDto } from '../dtos/create-user-intro-dto';
import { UserIntro } from '../entities/user-intro.entity';
import { UpdateUserIntroDTO } from '../dtos/update-user-intro-dto';

@Injectable()
export class UserIntroRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async createUserIntro(
    userId: number,
    userData: CreateUserIntroDto,
  ): Promise<UserIntro> {
    const userIntro = new UserIntro();
    userIntro.introduce = userData.introduce;
    userIntro.mainField = userData.mainField;
    userIntro.career = userData.career;
    userIntro.userId = userId;
    return await this.entityManager.save(UserIntro, userIntro);
  }

  async getUserIntro(mentorId: number): Promise<UserIntro> {
    const userIntro = await this.entityManager.findOne(UserIntro, {
      where: { userId: mentorId },
    });
    return userIntro;
  }

  async updateUserIntro(userData: UpdateUserIntroDTO): Promise<UserIntro> {
    return await this.entityManager.save(UserIntro, userData);
  }
}
