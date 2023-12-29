import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateUserIntroDto } from '../dtos/create-user-intro-dto';
import { UserIntro } from '../entities/user-intro.entity';

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

  async getUserIntro(userId: number): Promise<UserIntro> {
    const userIntro = await this.entityManager.findOne(UserIntro, {
      where: { userId: userId },
    });
    return userIntro;
  }
}
