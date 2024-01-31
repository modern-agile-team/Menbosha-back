import { Injectable } from '@nestjs/common';
import { UserIntroRepository } from '../repositories/user-intro.repository';
import { UserIntro } from '../entities/user-intro.entity';
import { CreateUserIntroDto } from '../dtos/create-user-intro-dto';
import { UpdateUserIntroDTO } from '../dtos/update-user-intro-dto';
import { ResponseUserIntroDto } from '../dtos/response-user-dto';

@Injectable()
export class UserIntroService {
  constructor(private readonly userIntroRepository: UserIntroRepository) {}

  async addUserIntro(
    userId: number,
    userData: CreateUserIntroDto,
  ): Promise<UserIntro> {
    return await this.userIntroRepository.createUserIntro(userId, userData);
  }

  async updateMyIntro(
    userId: number,
    userData: UpdateUserIntroDTO,
  ): Promise<ResponseUserIntroDto> {
    const existingUserIntro =
      await this.userIntroRepository.findUserIntro(userId);
    for (const key in userData) {
      if (userData.hasOwnProperty(key)) {
        existingUserIntro[key] = userData[key];
      }
    }
    await this.userIntroRepository.updateUserIntro(existingUserIntro);

    await this.userIntroRepository.updateUser(userId, {
      hopeCategoryId: userData.hopeCategoryId,
      activityCategoryId: userData.activityCategoryId,
      isMentor: userData.isMentor,
    });
    return {
      ...existingUserIntro,
      hopeCategoryId: userData.hopeCategoryId,
      activityCategoryId: userData.activityCategoryId,
      isMentor: userData.isMentor,
    };
  }
}
