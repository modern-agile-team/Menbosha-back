import { DynamicModule, Module, Type } from '@nestjs/common';
import { HotPostsService } from './services/hot-posts.service';
import { RequiredHotPostColumn } from './types/hot-post.type';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HOT_POST_REPOSITORY_TOKEN } from './constants/hot-post.token';
import { DataSource } from 'typeorm';

@Module({})
export class HotPostsModule {
  static forFeature(HotPostEntity: Type<RequiredHotPostColumn>): DynamicModule {
    return {
      module: HotPostsModule,
      imports: [TypeOrmModule.forFeature([HotPostEntity])],
      providers: [
        HotPostsService,
        {
          provide: HOT_POST_REPOSITORY_TOKEN,
          useFactory: (dataSource: DataSource) => {
            return dataSource.getRepository(HotPostEntity);
          },
          inject: [DataSource],
        },
      ],
      exports: [HotPostsService],
    };
  }
}
