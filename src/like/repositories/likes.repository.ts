import { Inject, Injectable } from '@nestjs/common';
import { LIKE_REPOSITORY_TOKEN } from '@src/like/constants/like.token';
import { RequiredLikeColumn } from '@src/like/types/like.type';
import {
  DeepPartial,
  DeleteResult,
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

@Injectable()
export class LikesRepository<E extends RequiredLikeColumn> {
  constructor(
    @Inject(LIKE_REPOSITORY_TOKEN)
    private readonly LikeRepository: Repository<E>,
  ) {}

  isExistLike(parentId: number, userId: number): Promise<boolean> {
    return this.LikeRepository.exists({
      where: {
        parentId,
        userId,
      },
    } as FindManyOptions<E>);
  }

  isExistLikeBy(id: number): Promise<boolean> {
    return this.LikeRepository.existsBy({
      id,
    } as FindOptionsWhere<E>);
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

  findOneLike(options: FindOneOptions<E>): Promise<E> {
    return this.LikeRepository.findOne(options);
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
  ): Promise<DeleteResult> {
    return entityManager.withRepository(this.LikeRepository).delete({
      parentId,
      userId,
    } as FindOptionsWhere<E>);
  }
}
