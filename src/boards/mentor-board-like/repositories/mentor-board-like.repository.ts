import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { MentorBoardLike } from '../entities/mentor-board-like.entity';

@Injectable()
export class MentorBoardLikeRepository {
  constructor(private readonly entityManager: EntityManager) {}
  createMentorBoardLike(entity: MentorBoardLike) {
    return this.entityManager.getRepository(MentorBoardLike).save(entity);
  }
}
