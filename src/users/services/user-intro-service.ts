import { Injectable } from '@nestjs/common';
import { CreateUserIntroDto } from '@src/users/dtos/create-user-intro-dto';
import { ResponseUserIntroDto } from '@src/users/dtos/response-user-dto';
import { UpdateUserIntroDTO } from '@src/users/dtos/update-user-intro-dto';
import { UserIntro } from '@src/users/entities/user-intro.entity';
import { UserIntroRepository } from '@src/users/repositories/user-intro.repository';

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
