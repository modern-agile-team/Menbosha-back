import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { RequiredLikeColumn } from '../types/like.type';
import { LIKE_REPOSITORY_TOKEN } from '../constants/like.token';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

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

    await this.LikeRepository.save(
      {
        userId,
        parentId,
      } as DeepPartial<E>,
      { reload: false },
    );
  }
}
