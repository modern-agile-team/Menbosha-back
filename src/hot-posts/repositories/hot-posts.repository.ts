import { Inject, Injectable } from '@nestjs/common';
import { RequiredHotPostColumn } from '../types/hot-post.type';
import { HOT_POST_REPOSITORY_TOKEN } from '../constants/hot-post.token';
import {
  EntityManager,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

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
    boardId: number,
  ): Promise<UpdateResult> {
    return entityManager.withRepository(this.HotPostRepository).update(
      { id: boardId } as FindOptionsWhere<E>,
      {
        popularAt: new Date(),
      } as unknown as QueryDeepPartialEntity<E>,
    );
  }

  findAllHotPosts(options: FindManyOptions<E>): Promise<E[]> {
    return this.HotPostRepository.find(options);
  }

  findAllHotPostsByQueryBuilder(
    queryBuilder: SelectQueryBuilder<E>,
  ): Promise<E[]> {
    return queryBuilder.getMany();
  }

  async deleteHotPost(
    entityManager: EntityManager,
    boardId: number,
  ): Promise<UpdateResult> {
    return entityManager.withRepository(this.HotPostRepository).update(
      { id: boardId } as FindOptionsWhere<E>,
      {
        popularAt: null,
      } as unknown as QueryDeepPartialEntity<E>,
    );
  }
}
