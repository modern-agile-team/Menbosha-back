import { Module } from '@nestjs/common';
import { MentorBoardLikeController } from './controllers/mentor-board-like.controller';
import { MentorBoardLikeService } from './services/mentor-board-like.service';

@Module({
  controllers: [MentorBoardLikeController],
  providers: [MentorBoardLikeService],
})
export class MentorBoardsLikeModule {}
