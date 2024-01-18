import { DynamicModule, Module, Type } from '@nestjs/common';
import { LikesService } from './services/likes.service';
import { RequiredLikeColumn } from './types/like.type';
import { LIKE_REPOSITORY_TOKEN } from './constants/like.token';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesRepository } from './repositories/likes.repository';

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
