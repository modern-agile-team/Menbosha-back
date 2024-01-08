import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class MentorBoardLikeRepository {
  constructor(private entityManager: EntityManager) {}
}
