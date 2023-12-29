import { Injectable } from '@nestjs/common';
import { UserIntroRepository } from '../repositories/user-intro-repositories';
import { UserIntro } from '../entities/user-intro.entity';
import { CreateUserIntroDto } from '../dtos/create-user-intro-dto';
import { ResponseUserIntroDto } from '../dtos/response-user-dto';
// import { UpdateUserIntroDTO } from '../dtos/update-user-intro-dto';
// import { ResponseUserIntroDto } from '../dtos/response-user-dto';

@Injectable()
export class UserIntroService {
  constructor(private readonly userIntroRepository: UserIntroRepository) {}

  async addUserIntro(
    userId: number,
    userData: CreateUserIntroDto,
  ): Promise<UserIntro> {
    return await this.userIntroRepository.createUserIntro(userId, userData);
  }

  // async updateUserIntro(
  //   userId: number,
  //   userData: UpdateUserIntroDTO,
  // ): Promise<ResponseUserIntroDto> {
  //   return await this.userIntroRepository.updateUserintro(userId, userData);
  // }

  async getUserIntro(userId: number): Promise<{ data: ResponseUserIntroDto }> {
    return await this.userIntroRepository.getUserIntro(userId);
  }
}
