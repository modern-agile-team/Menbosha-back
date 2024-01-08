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
  async createMentorBoardLike(boardId: number, userId: number) {
    const existBoard = await this.mentorBoardService.findOneByOrNotFound({
      where: { id: boardId },
    });

    await this.likesService.createLike(existBoard.id, userId);

    return { success: true, msg: '좋아요 생성 성공', isLike: true };
  }

  async getMentorBoardLikes(boardId: number, userId: number) {
    await this.mentorBoardService.findOneByOrNotFound({
      where: { id: boardId },
    });

    const mentorBoardLikes = await this.likesService.getLike({
      where: { parentId: boardId },
    });

    return mentorBoardLikes.find(
      (mentorBoardLike) => mentorBoardLike.userId === userId,
    )
      ? { isLike: true, boardLikesCount: mentorBoardLikes.length }
      : { isLike: false, boardLikesCount: mentorBoardLikes.length };
  }

  async deleteMentorBoardLike(boardId: number, userId: number) {
    const existBoard = await this.mentorBoardService.findOneByOrNotFound({
      where: { id: boardId },
    });

    await this.likesService.deleteLike(existBoard.id, userId);

    return { success: true, msg: '좋아요 삭제 성공', isLike: false };
  }
}
