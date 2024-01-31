import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { MentorReviewChecklistCount } from '../entities/mentor-review-checklist-count.entity';

@Injectable()
export class MentorReviewChecklistCountRepository {
  constructor(private readonly entityManager: EntityManager) {}

  findOneMentorReviewChecklistCount(userId: number) {
    return this.entityManager
      .getRepository(MentorReviewChecklistCount)
      .findOne({ where: { userId } });
  }
}
