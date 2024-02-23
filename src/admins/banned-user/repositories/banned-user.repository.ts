import { Injectable } from '@nestjs/common';
import { BannedUser } from 'src/admins/entities/banned-user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class BannedUserRepository {
  constructor(private readonly entityManager: EntityManager) {}

  createBannedUser() {
    return this.entityManager.getRepository(BannedUser).save({});
  }
}
