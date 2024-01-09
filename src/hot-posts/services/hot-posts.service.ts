import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RequiredHotPostColumn } from '../types/hot-post.type';
import { HOT_POST_REPOSITORY_TOKEN } from '../constants/hot-post.token';
import {
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

@Injectable()
export class HotPostsService<E extends RequiredHotPostColumn> {
  constructor(
    @Inject(HOT_POST_REPOSITORY_TOKEN)
    private readonly HotPostRepository: Repository<E>,
  ) {}

  async createHotPost(parentId: number, likeCount: number): Promise<void> {
    await this.HotPostRepository.save(
      { parentId, likeCount } as DeepPartial<E>,
      {
        reload: false,
      },
    );
  }

  findAllHotPosts(): Promise<E[]> {
    return this.HotPostRepository.find(options);
  }

  async increaseLikeCount(parentId: number): Promise<void> {
    const updatedResult = await this.HotPostRepository.increment(
      { parentId } as FindOptionsWhere<E>,
      'likeCount',
      1,
    );

    if (!updatedResult.affected) {
      throw new InternalServerErrorException('좋아요 업데이트 중 에러 발생');
    }
  }
}
