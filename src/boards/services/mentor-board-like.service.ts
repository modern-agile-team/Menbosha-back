import { Injectable } from '@nestjs/common';
import { MentorBoardLike } from '../entities/mentor-board-like.entity';
import { MentorBoardService } from 'src/boards/services/mentor.board.service';
import { LikesService } from 'src/like/services/likes.service';

@Injectable()
export class MentorBoardLikeService {
  constructor(
    private readonly likesService: LikesService<MentorBoardLike>,
    private readonly mentorBoardService: MentorBoardService,
  ) {}
  async createMentorBoardLike(
    boardId: number,
    userId: number,
  ): Promise<{ isLike: boolean }> {
    const existBoard = await this.mentorBoardService.findOneByOrNotFound({
      where: { id: boardId },
    });

    await this.likesService.createLike(existBoard.id, userId);

    return { isLike: true };
  }

  async deleteMentorBoardLike(
    boardId: number,
    userId: number,
  ): Promise<{ isLike: boolean }> {
    const existBoard = await this.mentorBoardService.findOneByOrNotFound({
      where: { id: boardId },
    });

    await this.likesService.deleteLike(existBoard.id, userId);

    return { isLike: false };
  }
}
