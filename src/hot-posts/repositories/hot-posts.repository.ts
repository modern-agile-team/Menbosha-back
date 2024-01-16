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

/**
 * @todo 추후에 어떤 방식 선택할지 결정하고 둘 중 하나 삭제
 */
@Injectable()
export class HotPostsRepository<E extends RequiredHotPostColumn> {
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

  findAllHotPosts(options: FindManyOptions<E>): Promise<E[]> {
    return this.HotPostRepository.find(options);
  }

  async deleteHotPost(
    entityManager: EntityManager,
    parentId: number,
  ): Promise<void> {
    await entityManager
      .withRepository(this.HotPostRepository)
      .delete({ parentId } as FindOptionsWhere<E>);
  }

  async decreaseLikeCount(
    entityManager: EntityManager,
    parentId: number,
  ): Promise<void> {
    const updatedResult = await entityManager
      .withRepository(this.HotPostRepository)
      .decrement({ parentId } as FindOptionsWhere<E>, 'likeCount', 1);

    if (!updatedResult.affected) {
      throw new InternalServerErrorException(
        '좋아요 업데이트 중 서버 에러 발생',
      );
    }
  }
}
