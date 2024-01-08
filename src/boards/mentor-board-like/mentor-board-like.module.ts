import { Module } from '@nestjs/common';
import { MentorBoardLikeController } from './controllers/mentor-board-like.controller';
import { MentorBoardLikeService } from './services/mentor-board-like.service';
import { LikesModule } from 'src/common-boards/likes.module';
import { MentorBoardLike } from './entities/mentor-board-like.entity';

@Module({
  imports: [LikesModule.forFeature(MentorBoardLike)],
  controllers: [MentorBoardLikeController],
  providers: [MentorBoardLikeService],
})
export class MentorBoardsLikeModule {}
