import { DynamicModule, Module, Type } from '@nestjs/common';
import { CommonBoardsService } from './services/common-boards.service';
import { RequiredCommonBoardColumn } from './types/common-board.type';
import { COMMON_BOARD_REPOSITORY_TOKEN } from './constants/common-boards.token';
import { DataSource } from 'typeorm';

@Module({
  providers: [CommonBoardsService],
  exports: [CommonBoardsService],
})
export class CommonBoardsModule {
  static forFeature(
    boardEntity: Type<RequiredCommonBoardColumn>,
  ): DynamicModule {
    return {
      module: CommonBoardsModule,
      providers: [
        {
          provide: COMMON_BOARD_REPOSITORY_TOKEN,
          useFactory: (dataSource: DataSource) => {
            return dataSource.getRepository(boardEntity);
          },
        },
      ],
    };
  }
}
