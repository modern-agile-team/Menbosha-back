import { ConflictException, Injectable } from '@nestjs/common';
import { RequiredLikeColumn } from '../types/like.type';
import { EntityManager, FindManyOptions, FindOptionsWhere } from 'typeorm';
import { LikesRepository } from '../repositories/likes.repository';

@Injectable()
export class LikesService<E extends RequiredLikeColumn> {
  constructor(private readonly likesRepository: LikesRepository<E>) {}

  async createLike(parentId: number, userId: number): Promise<E> {
    const isExistLike = await this.likesRepository.isExistLike({
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
    const isExistLike = await this.likesRepository.isExistLike({
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
