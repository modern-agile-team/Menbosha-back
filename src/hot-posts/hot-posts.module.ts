import { DynamicModule, Module, Type } from '@nestjs/common';
import { RequiredHotPostColumn } from './types/hot-post.type';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HOT_POST_REPOSITORY_TOKEN } from './constants/hot-post.token';
import { DataSource } from 'typeorm';
import { HotPostsRepository } from './repositories/hot-posts.repository';

@Module({})
export class HotPostsModule {
  static forFeature(HotPostEntity: Type<RequiredHotPostColumn>): DynamicModule {
    return {
      module: HotPostsModule,
      imports: [TypeOrmModule.forFeature([HotPostEntity])],
      providers: [
        HotPostsRepository,
        {
          provide: HOT_POST_REPOSITORY_TOKEN,
          useFactory: (dataSource: DataSource) => {
            return dataSource.getRepository(HotPostEntity);
          },
          inject: [DataSource],
        },
      ],
      exports: [HotPostsRepository],
    };
  }
}
