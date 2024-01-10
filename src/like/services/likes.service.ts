import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { RequiredLikeColumn } from '../types/like.type';
import { LIKE_REPOSITORY_TOKEN } from '../constants/like.token';
import {
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

@Injectable()
export class LikesService<E extends RequiredLikeColumn> {
  constructor(
    @Inject(LIKE_REPOSITORY_TOKEN)
    private readonly LikeRepository: Repository<E>,
  ) {}

  async createLike(parentId: number, userId: number) {
    const isExistLike = await this.LikeRepository.exist({
      where: {
        userId,
        parentId,
      } as FindOptionsWhere<E>,
    });

    if (isExistLike) {
      throw new ConflictException('이미 좋아요가 존재합니다.');
    }

    return this.LikeRepository.save({
      userId,
      parentId,
    } as DeepPartial<E>);
  }

  getLike(options: FindManyOptions<E>) {
    return this.LikeRepository.find({ options } as FindManyOptions<E>);
  }

  async deleteLike(parentId: number, userId: number) {
    const isExistLike = await this.LikeRepository.exist({
      where: {
        userId,
        parentId,
      } as FindOptionsWhere<E>,
    });

    if (!isExistLike) {
      throw new ConflictException('좋아요가 없습니다.');
    }

    await this.LikeRepository.delete({
      parentId,
      userId,
    } as FindOptionsWhere<E>);
  }
}
