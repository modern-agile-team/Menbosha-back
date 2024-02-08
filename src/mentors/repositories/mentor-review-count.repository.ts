import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { MentorReviewChecklist } from '../entities/mentor-review-checklist.entity';

@Injectable()
export class MentorReviewCountRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async checkAndAwardReviews(
    mentorReviewId: number,
  ): Promise<MentorReviewChecklist> {
    return this.entityManager.find(MentorReviewChecklist, {
      where: { mentorReviewId },
    });
  }
}
