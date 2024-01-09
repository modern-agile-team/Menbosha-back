import { Inject, Injectable } from '@nestjs/common';
import { RequiredHotPostColumn } from '../types/hot-post.type';
import { HOT_POST_REPOSITORY_TOKEN } from '../constants/hot-post.token';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class HotPostsService<E extends RequiredHotPostColumn> {
  constructor(
    @Inject(HOT_POST_REPOSITORY_TOKEN)
    private readonly HotPostRepository: Repository<E>,
  ) {}

  async createHotPost(parentId: number, likeCount: number): Promise<E> {
    await this.HotPostRepository.save(
      { parentId, likeCount } as DeepPartial<E>,
      {
        reload: false,
      },
    );
  }

  increaseLikeCount(boardId: number) {}
}
