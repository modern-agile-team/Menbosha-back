import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserIntro } from '../entities/user-intro.entity';

@Injectable()
export class UserIntroRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async getUserIntro(userId: number) {
    return await this.entityManager.find(UserIntro, { where: { userId } });
  }
}
