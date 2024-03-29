import { EntityManager } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { MentorBoardLike } from '@src/entities/MentorBoardLike';

@Injectable()
export class MentorBoardLikeRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async countMentorBoardLike(mentorBoardId: number): Promise<number> {
    return await this.entityManager.count(MentorBoardLike, {
      where: { mentorBoard: { id: mentorBoardId } },
    });
  }

  async isLike(userId: number, mentorBoardId: number): Promise<boolean> {
    return await this.entityManager.exists(MentorBoardLike, {
      where: { parentId: mentorBoardId, userId },
    });
  }
}
