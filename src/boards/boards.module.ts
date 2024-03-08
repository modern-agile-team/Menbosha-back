import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@src/common/redis/redis.module';
import { AuthModule } from '@src/auth/auth.module';
import { LikesModule } from '@src/like/likes.module';
import { CategoryModule } from '@src/category/category.module';
import { QueryBuilderHelper } from '@src/helpers/query-builder.helper';
import { TotalCountModule } from '@src/total-count/total-count.module';
import { HelpMeBoardController } from '@src/boards/controllers/help.me.boards.controller';
import { MentorBoardLikeController } from '@src/boards/controllers/mentor-board-likes.controller';
import { MentorBoardController } from '@src/boards/controllers/mentor.board.controller';
import { HelpMeBoardImage } from '@src/boards/entities/help-me-board-image.entity';
import { HelpMeBoard } from '@src/boards/entities/help-me-board.entity';
import { MentorBoardImage } from '@src/boards/entities/mentor-board-image.entity';
import { MentorBoardLike } from '@src/boards/entities/mentor-board-like.entity';
import { MentorBoard } from '@src/boards/entities/mentor-board.entity';
import { BoardImageRepository } from '@src/boards/repository/boardImage.repository';
import { HelpMeBoardRepository } from '@src/boards/repository/help.me.board.repository';
import { MentorBoardLikeRepository } from '@src/boards/repository/mentor.board.likes.repository';
import { MentorBoardRepository } from '@src/boards/repository/mentor.boards.repository';
import { BoardImagesService } from '@src/boards/services/BoardImage.service';
import { HelpMeBoardService } from '@src/boards/services/help.me.board.service';
import { MentorBoardLikeService } from '@src/boards/services/mentor-board-likes.service';
import { MentorBoardService } from '@src/boards/services/mentor.board.service';
import { S3Service } from '@src/common/s3/s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MentorBoard,
      HelpMeBoard,
      HelpMeBoardImage,
      MentorBoardImage,
    ]),
    AuthModule,
    RedisModule,
    LikesModule.forFeature(MentorBoardLike),
    CategoryModule,
    TotalCountModule,
  ],
  controllers: [
    MentorBoardController,
    HelpMeBoardController,
    MentorBoardLikeController,
  ],
  providers: [
    HelpMeBoardService,
    MentorBoardService,
    MentorBoardLikeService,
    BoardImagesService,
    S3Service,
    BoardImageRepository,
    HelpMeBoardRepository,
    MentorBoardRepository,
    MentorBoardLikeRepository,
    QueryBuilderHelper,
  ],
  exports: [HelpMeBoardService],
})
@Module({})
export class BoardsModule {}
