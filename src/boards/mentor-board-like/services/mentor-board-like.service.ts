import { Injectable } from '@nestjs/common';
import { MentorBoardLikeRepository } from '../repositories/mentor-board-like.repository';

@Injectable()
export class MentorBoardLikeService {
  constructor(
    private readonly mentorBoardLikeRepository: MentorBoardLikeRepository,
  ) {}
  createBoardLike(userId: number, boardId: number) {
    return this.mentorBoardLikeRepository.createMentorBoardLike();
  }
}
