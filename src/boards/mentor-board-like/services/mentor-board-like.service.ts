import { Injectable } from '@nestjs/common';
import { MentorBoardLikeRepository } from '../repositories/mentor-board-like.repository';
import { MentorBoardLike } from '../entities/mentor-board-like.entity';
import { MentorBoardService } from 'src/boards/services/mentor.board.service';

@Injectable()
export class MentorBoardLikeService {
  constructor(
    private readonly mentorBoardLikeRepository: MentorBoardLikeRepository,
    private readonly mentorBoardService: MentorBoardService,
  ) {}
  createBoardLike(userId: number, boardId: number) {
    const mentorBoardLike = new MentorBoardLike();
    mentorBoardLike.mentorBoardId = boardId;
    mentorBoardLike.userId = userId;

    return this.mentorBoardLikeRepository.createMentorBoardLike(
      mentorBoardLike,
    );
  }
}
