import { Injectable } from '@nestjs/common';
import { EntityManager, UpdateResult } from 'typeorm';
import { MentorReviewChecklistCount } from '../entities/mentor-review-checklist-count.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class MentorReviewChecklistCountRepository {
  constructor(private readonly entityManager: EntityManager) {}

  incrementMentorReviewChecklistCounts(
    entityManager: EntityManager,
    userId: number,
    incrementColumns: QueryDeepPartialEntity<MentorReviewChecklistCount>,
  ): Promise<UpdateResult> {
    return entityManager
      .getRepository(MentorReviewChecklistCount)
      .createQueryBuilder('mentorReviewChecklistCount')
      .update(MentorReviewChecklistCount)
      .where({ userId })
      .set({ ...incrementColumns })
      .execute();
  }

  findOneMentorReviewChecklistCount(
    userId: number,
  ): Promise<MentorReviewChecklistCount> {
    return this.entityManager
      .getRepository(MentorReviewChecklistCount)
      .findOne({ where: { userId } });
  }

  async findOneByUserId(userId: number): Promise<MentorReviewChecklistCount> {
    return await this.entityManager.findOne(MentorReviewChecklistCount, {
      where: { userId },
    });
  }
}
