import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RequiredHotPostColumn } from '../types/hot-post.type';
import { HOT_POST_REPOSITORY_TOKEN } from '../constants/hot-post.token';
import {
  DeepPartial,
  EntityManager,
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

  async createHotPost(
    entityManager: EntityManager,
    parentId: number,
    likeCount: number,
  ): Promise<void> {
    await entityManager
      .withRepository(this.HotPostRepository)
      .save({ parentId, likeCount } as DeepPartial<E>, {
        reload: false,
      });
  }

  findAllHotPosts(options: FindManyOptions<E>): Promise<E[]> {
    return this.HotPostRepository.find(options);
  }

  async increaseLikeCount(
    entityManager: EntityManager,
    parentId: number,
  ): Promise<void> {
    const updatedResult = await entityManager
      .withRepository(this.HotPostRepository)
      .increment({ parentId } as FindOptionsWhere<E>, 'likeCount', 1);

    if (!updatedResult.affected) {
      throw new InternalServerErrorException(
        '좋아요 업데이트 중 서버 에러 발생',
      );
    }
  }
}
