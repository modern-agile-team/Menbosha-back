import { Injectable } from '@nestjs/common';
import { CreateBannedUserBodyDto } from '@src/admins/dtos/create-banned-user-body.dto';
import { BannedUser } from '@src/admins/banned-user/entities/banned-user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class BannedUserRepository {
  constructor(private readonly entityManager: EntityManager) {}

  createBannedUser(
    entityManager: EntityManager,
    adminId: number,
    userId: number,
    createBannedUserBodyDto: CreateBannedUserBodyDto,
  ): Promise<BannedUser> {
    return entityManager.getRepository(BannedUser).save({
      banUserId: adminId,
      bannedUserId: userId,
      ...createBannedUserBodyDto,
    });
  }
}
