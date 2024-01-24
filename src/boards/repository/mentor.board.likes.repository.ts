import { EntityManager } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { MentorBoardLike } from '../entities/mentor-board-like.entity';

@Injectable()
export class MentorBoardLikeRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async countMentorBoardLike(mentorBoardId: number): Promise<number> {
    return await this.entityManager.count(MentorBoardLike, {
      where: { mentorBoard: { id: mentorBoardId } },
    });
  }
}
