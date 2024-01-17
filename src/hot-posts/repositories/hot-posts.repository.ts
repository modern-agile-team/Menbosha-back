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

@Injectable()
export class HotPostsRepository<E extends RequiredHotPostColumn> {
  constructor(
    @Inject(HOT_POST_REPOSITORY_TOKEN)
    private readonly HotPostRepository: Repository<E>,
  ) {}

  async updateToHotPost(
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

  async updateToNotHotPost(
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
