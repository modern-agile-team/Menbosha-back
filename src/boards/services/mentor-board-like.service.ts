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
  async createBoardLike(userId: number, boardId: number) {
    const existBoard = await this.mentorBoardService.findOneByOrNotFound({
      where: { id: boardId },
    });

    await this.likesService.createLike(existBoard.id, userId);

    return { success: true, msg: '좋아요 생성 성공', isLike: true };
  }
}
