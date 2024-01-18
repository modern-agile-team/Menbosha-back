import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpMeBoardController } from './controllers/help.me.boards.controller';
import { MentorBoardController } from './controllers/mentor.board.controller';
import { HelpMeBoardService } from './services/help.me.board.service';
import { MentorBoardService } from './services/mentor.board.service';
import { HelpMeBoard } from './entities/help-me-board.entity';
import { BoardImagesService } from './services/BoardImage.service';
import { S3Service } from 'src/common/s3/s3.service';
import { MentorBoard } from './entities/mentor-board.entity';
import { HelpMeBoardRepository } from './repository/help.me.board.repository';
import { MentorBoardRepository } from './repository/mentor.boards.repository';
import { BoardImageRepository } from './repository/boardImage.repository';
import { HelpMeBoardImage } from './entities/help-me-board-image.entity';
import { MentorBoardImage } from './entities/mentor-board-image.entity';
import { RedisModule } from 'src/common/redis/redis.module';
import { AuthModule } from 'src/auth/auth.module';
import { LikesModule } from 'src/like/likes.module';
import { MentorBoardLike } from './entities/mentor-board-like.entity';
import { MentorBoardLikeController } from './controllers/mentor-board-likes.controller';
import { MentorBoardLikeService } from './services/mentor-board-likes.service';
import { HotPostsModule } from 'src/hot-posts/hot-posts.module';
import { MentorBoardHotPostsController } from './controllers/mentor-board-hot-posts.controller';
import { MentorBoardHotPostsService } from './services/mentor-board-hot-posts.service';
import { CategoryModule } from 'src/category/category.module';

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
    HotPostsModule.forFeature(MentorBoard),
    CategoryModule,
  ],
  controllers: [
    MentorBoardController,
    HelpMeBoardController,
    MentorBoardLikeController,
    MentorBoardHotPostsController,
  ],
  providers: [
    HelpMeBoardService,
    MentorBoardService,
    MentorBoardLikeService,
    MentorBoardHotPostsService,
    BoardImagesService,
    S3Service,
    BoardImageRepository,
    HelpMeBoardRepository,
    MentorBoardRepository,
  ],
})
@Module({})
export class BoardsModule {}
