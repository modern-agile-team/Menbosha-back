import { DynamicModule, Module, Type } from '@nestjs/common';
import { LikesService } from './services/likes.service';
import { RequiredLikeColumn } from './types/like.type';
import { LIKE_REPOSITORY_TOKEN } from './constants/like.token';
import { DataSource } from 'typeorm';

@Module({
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {
  static forFeature(LikeEntity: Type<RequiredLikeColumn>): DynamicModule {
    return {
      module: LikesModule,
      providers: [
        {
          provide: LIKE_REPOSITORY_TOKEN,
          useFactory: (dataSource: DataSource) => {
            return dataSource.getRepository(LikeEntity);
          },
          inject: [DataSource],
        },
      ],
      exports: [LikesService],
    };
  }
}
