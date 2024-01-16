import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class MentorBoardHotPostsRepository {
  constructor(entityManager: EntityManager) {}
}
