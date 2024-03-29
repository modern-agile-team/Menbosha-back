import { Injectable } from '@nestjs/common';
import { CreateBannedUserBodyDto } from '@src/admins/banned-user/dtos/create-banned-user-body.dto';
import { BannedUser } from '@src/entities/BannedUser';
import { EntityManager, FindOneOptions } from 'typeorm';

@Injectable()
export class BannedUserRepository {
  constructor(private readonly entityManager: EntityManager) {}

  create(
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

  findAllAndCount(
    skip: number,
    pageSize: number,
    where: Record<string, any>,
    order: Record<string, any>,
  ): Promise<[BannedUser[], number]> {
    return this.entityManager.getRepository(BannedUser).findAndCount({
      select: ['id', 'banUserId', 'bannedUserId', 'bannedAt', 'endAt'],
      where,
      order,
      skip,
      take: pageSize,
    });
  }

  findOne(options: FindOneOptions<BannedUser>): Promise<BannedUser> {
    return this.entityManager.getRepository(BannedUser).findOne(options);
  }
}
