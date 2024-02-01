import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RequiredLikeColumn } from '../types/like.type';
import {
  DeleteResult,
  EntityManager,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
import { LikesRepository } from '../repositories/likes.repository';

@Injectable()
export class LikesService<E extends RequiredLikeColumn> {
  constructor(private readonly likesRepository: LikesRepository<E>) {}

  async createLike(parentId: number, userId: number): Promise<E> {
    const isExistLike = await this.likesRepository.isExistLike(
      userId,
      parentId,
    );

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

  findOneLike(options: FindOneOptions<E>): Promise<E> {
    return this.likesRepository.findOneLike(options);
  }

  isExistLike(parentId: number, userId: number) {
    return this.likesRepository.isExistLike(parentId, userId);
  }

  isExistLikeBy(id: number) {
    return this.likesRepository.isExistLikeBy(id);
  }

  async deleteLike(parentId: number, userId: number): Promise<void> {
    const isExistLike = await this.likesRepository.isExistLike(
      userId,
      parentId,
    );

    if (!isExistLike) {
      throw new ConflictException('이미 좋아요가 없습니다.');
    }

    return this.likesRepository.deleteLike(parentId, userId);
  }

  async deleteLikeWithEntityManager(
    entityManager: EntityManager,
    parentId: number,
    userId: number,
  ): Promise<DeleteResult> {
    const updatedResult =
      await this.likesRepository.deleteLikeWithEntityManager(
        entityManager,
        parentId,
        userId,
      );

    if (!updatedResult.affected) {
      throw new InternalServerErrorException('좋아요 삭제 중 서버 에러 발생');
    }

    return updatedResult;
  }
}
