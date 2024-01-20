import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class MentorsRepository {
  constructor(private readonly entityManager: EntityManager) {}

  createMentorReview() {}

  createMentorReviewChecklist() {}
}
