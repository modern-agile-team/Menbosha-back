import { Injectable } from '@nestjs/common';
import { MentorBoardLike } from '../entities/mentor-board-like.entity';
import { MentorBoardService } from 'src/boards/services/mentor.board.service';
import { LikesService } from 'src/like/services/likes.service';
import { MentorBoardLikeDto } from '../dto/mentorBoard/mentor-board-like.dto';

@Injectable()
export class MentorBoardLikeService {
  constructor(
    private readonly likesService: LikesService<MentorBoardLike>,
    private readonly mentorBoardService: MentorBoardService,
  ) {}
  async createMentorBoardLike(
    boardId: number,
    userId: number,
  ): Promise<MentorBoardLikeDto> {
    const existBoard = await this.mentorBoardService.findOneByOrNotFound({
      where: { id: boardId },
    });

    const newLike = await this.likesService.createLike(existBoard.id, userId);

    return new MentorBoardLikeDto(newLike);
  }

  async deleteMentorBoardLike(
    boardId: number,
    userId: number,
  ): Promise<{ isLike: false }> {
    const existBoard = await this.mentorBoardService.findOneByOrNotFound({
      where: { id: boardId },
    });

    await this.likesService.deleteLike(existBoard.id, userId);

    return { isLike: false };
  }
}
