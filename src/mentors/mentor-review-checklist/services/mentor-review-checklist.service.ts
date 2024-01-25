import { Injectable } from '@nestjs/common';
import { MentorReviewChecklistRepository } from '../repositories/mentor-review-checklists.repository';
import { CreateMentorReviewChecklistRequestBodyDto } from 'src/mentors/dtos/create-mentor-review-checklist-request-body.dto';
import { EntityManager } from 'typeorm';

@Injectable()
export class MentorReviewChecklistService {
  constructor(
    private readonly mentorReviewChecklistRepository: MentorReviewChecklistRepository,
  ) {}

  createMentorReviewChecklist(
    entityManager: EntityManager,
    mentorReviewId: number,
    createMentorReviewChecklistRequestBodyDto: CreateMentorReviewChecklistRequestBodyDto,
  ) {
    return entityManager
      .withRepository(this.mentorReviewChecklistRepository)
      .save({
        mentorReviewId,
        ...new CreateMentorReviewChecklistRequestBodyDto(
          createMentorReviewChecklistRequestBodyDto,
        ),
      });
  }

  removeMentorReviewChecklist(
    entityManager: EntityManager,
    mentorReviewId: number,
  ) {
    return entityManager
      .withRepository(this.mentorReviewChecklistRepository)
      .update({ mentorReviewId }, { deletedAt: new Date() });
  }
}
