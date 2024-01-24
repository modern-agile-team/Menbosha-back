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

  async updateUserIntro(
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
    const updateUserIntro =
      await this.userIntroRepository.updateUserIntro(existingUserIntro);
    return {
      id: updateUserIntro.id,
      userId: updateUserIntro.userId,
      shortIntro: updateUserIntro.shortIntro,
      career: updateUserIntro.career,
      customCategory: updateUserIntro.customCategory,
      detail: updateUserIntro.detail,
      portfolio: updateUserIntro.portfolio,
      sns: updateUserIntro.sns,
    };
  }
}
