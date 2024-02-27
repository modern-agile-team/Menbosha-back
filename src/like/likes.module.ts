import { DynamicModule, Module, Type } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LIKE_REPOSITORY_TOKEN } from '@src/like/constants/like.token';
import { LikesRepository } from '@src/like/repositories/likes.repository';
import { LikesService } from '@src/like/services/likes.service';
import { RequiredLikeColumn } from '@src/like/types/like.type';

@Module({})
export class LikesModule {
  static forFeature(LikeEntity: Type<RequiredLikeColumn>): DynamicModule {
    return {
      module: LikesModule,
      imports: [TypeOrmModule.forFeature([LikeEntity])],
      providers: [
        LikesService,
        LikesRepository,
        {
          provide: LIKE_REPOSITORY_TOKEN,
          useFactory: (dataSource: DataSource) => {
            return dataSource.getRepository(LikeEntity);
          },
          inject: [DataSource],
        },
      ],
      exports: [LikesService, LikesRepository],
    };
  }
}
