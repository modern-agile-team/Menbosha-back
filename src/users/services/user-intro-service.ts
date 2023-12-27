import { Injectable } from '@nestjs/common';
import { UserIntroRepository } from '../repositories/user-intro-repositories';
import { UserIntro } from '../entities/user-intro.entity';

@Injectable()
export class UserIntroService {
  constructor(private readonly userIntroRepository: UserIntroRepository) {}

  async addUserIntro(userId: number): Promise<UserIntro> {}
}
