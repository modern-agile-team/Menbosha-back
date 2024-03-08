import { Injectable } from '@nestjs/common';
import { MentorReviewChecklistCount } from '@src/entities/MentorReviewChecklistCount';
import { EntityManager } from 'typeorm';

@Injectable()
export class MentorReviewChecklistCountRepository {
  constructor(private readonly entityManager: EntityManager) {}

  findOneMentorReviewChecklistCount(
    mentorId: number,
  ): Promise<MentorReviewChecklistCount> {
    return this.entityManager
      .getRepository(MentorReviewChecklistCount)
      .findOne({ where: { mentorId } });
  }
}
