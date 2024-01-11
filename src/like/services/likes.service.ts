import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { RequiredLikeColumn } from '../types/like.type';
import { LIKE_REPOSITORY_TOKEN } from '../constants/like.token';
import {
  EntityManager,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { LikesRepository } from '../repositories/likes.repository';

@Injectable()
export class LikesService<E extends RequiredLikeColumn> {
  constructor(
    @Inject(LIKE_REPOSITORY_TOKEN)
    private readonly LikeRepository: Repository<E>,
    private readonly likesRepository: LikesRepository<E>,
  ) {}

  async createLike(parentId: number, userId: number): Promise<void> {
    const isExistLike = await this.likesRepository.checkExistLike({
      where: {
        userId,
        parentId,
      } as FindOptionsWhere<E>,
    });

    if (isExistLike) {
      throw new ConflictException('이미 좋아요가 존재합니다.');
    }

    return this.likesRepository.createLike(parentId, userId);
  }

  createLikeWithEntityManager(
    entityManager: EntityManager,
    parentId: number,
    userId: number,
  ): Promise<E> {
    return this.likesRepository.createLikeWithEntityManager(
      entityManager,
      parentId,
      userId,
    );
  }

  findLikes(options: FindManyOptions<E>): Promise<E[]> {
    return this.likesRepository.findLikes(options);
  }

  async deleteLike(parentId: number, userId: number): Promise<void> {
    const isExistLike = await this.likesRepository.checkExistLike({
      where: {
        userId,
        parentId,
      } as FindOptionsWhere<E>,
    });

    if (!isExistLike) {
      throw new ConflictException('이미 좋아요가 없습니다.');
    }

    return this.likesRepository.deleteLike(parentId, userId);
  }

  deleteLikeWithEntityManager(
    entityManager: EntityManager,
    parentId: number,
    userId: number,
  ): Promise<void> {
    return this.likesRepository.deleteLikeWithEntityManager(
      entityManager,
      parentId,
      userId,
    );
  }
}
