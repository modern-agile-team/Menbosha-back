import { Injectable } from '@nestjs/common';
import { DeepPartial, EntityManager } from 'typeorm';
import { MentorBoardLike } from '../entities/mentor-board-like.entity';

@Injectable()
export class MentorBoardLikeRepository {
  constructor(private readonly entityManager: EntityManager) {}
  createMentorBoardLike(entities: MentorBoardLike[]) {
    const mentorBoard;

    return this.entityManager.getRepository(MentorBoardLike).save(entities);
  }
}
