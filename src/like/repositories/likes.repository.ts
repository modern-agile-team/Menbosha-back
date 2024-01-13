import { Inject, Injectable } from '@nestjs/common';
import { RequiredLikeColumn } from '../types/like.type';
import { LIKE_REPOSITORY_TOKEN } from '../constants/like.token';
import {
  DeepPartial,
  EntityManager,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

@Injectable()
export class LikesRepository<E extends RequiredLikeColumn> {
  constructor(
    @Inject(LIKE_REPOSITORY_TOKEN)
    private readonly LikeRepository: Repository<E>,
  ) {}

  isExistLike(options: FindManyOptions<E>) {
    return this.LikeRepository.exist(options);
  }

  createLike(parentId: number, userId: number): Promise<E> {
    return this.LikeRepository.save({
      userId,
      parentId,
    } as DeepPartial<E>);
  }

  createLikeWithEntityManager(
    entityManager: EntityManager,
    parentId: number,
    userId: number,
  ): Promise<E> {
    return entityManager.withRepository(this.LikeRepository).save({
      userId,
      parentId,
    } as DeepPartial<E>);
  }

  findLikes(options: FindManyOptions<E>): Promise<E[]> {
    return this.LikeRepository.find({ options } as FindManyOptions<E>);
  }

  async deleteLike(parentId: number, userId: number): Promise<void> {
    await this.LikeRepository.delete({
      parentId,
      userId,
    } as FindOptionsWhere<E>);
  }

  async deleteLikeWithEntityManager(
    entityManager: EntityManager,
    parentId: number,
    userId: number,
  ): Promise<void> {
    await entityManager.withRepository(this.LikeRepository).delete({
      parentId,
      userId,
    } as FindOptionsWhere<E>);
  }
}
