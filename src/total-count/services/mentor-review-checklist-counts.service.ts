import { Injectable } from '@nestjs/common';
import { MentorReviewChecklistCountRepository } from '../repositories/mentor-review-checklist-count.repository';
import { MentorReviewChecklistCountDto } from '../dtos/mentor-review-checklist-count.dto';
import { EntityManager, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { MentorReviewChecklistCount } from '../entities/mentor-review-checklist-count.entity';

@Injectable()
export class MentorReviewChecklistCountsService {
  constructor(
    private readonly mentorReviewChecklistRepository: MentorReviewChecklistCountRepository,
  ) {}

  incrementMentorReviewChecklistCounts(
    entityManager: EntityManager,
    userId: number,
    incrementColumns: QueryDeepPartialEntity<MentorReviewChecklistCount>,
  ): Promise<UpdateResult> {
    return this.mentorReviewChecklistRepository.incrementMentorReviewChecklistCounts(
      entityManager,
      userId,
      incrementColumns,
    );
  }

  async findOneMentorReviewChecklistCountOrFail(
    userId: number,
  ): Promise<MentorReviewChecklistCountDto> {
    const mentorReviewChecklistCount =
      await this.mentorReviewChecklistRepository.findOneMentorReviewChecklistCount(
        userId,
      );

    return new MentorReviewChecklistCountDto(mentorReviewChecklistCount);
  }
}
