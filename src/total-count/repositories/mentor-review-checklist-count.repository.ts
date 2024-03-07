import { Injectable } from '@nestjs/common';
import { MentorReviewChecklistCount } from '@src/total-count/entities/mentor-review-checklist-count.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class MentorReviewChecklistCountRepository {
  constructor(private readonly entityManager: EntityManager) {}

  findOneMentorReviewChecklistCount(
    userId: number,
  ): Promise<MentorReviewChecklistCount> {
    return this.entityManager
      .getRepository(MentorReviewChecklistCount)
      .findOne({ where: { userId } });
  }
}
