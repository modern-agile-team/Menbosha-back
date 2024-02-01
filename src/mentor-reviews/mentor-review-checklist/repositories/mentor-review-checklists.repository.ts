import { Injectable } from '@nestjs/common';
import { CreateMentorReviewChecklistRequestBodyDto } from 'src/mentor-reviews/dtos/create-mentor-review-checklist-request-body.dto';
import { EntityManager } from 'typeorm';
import { MentorReviewChecklist } from '../entities/mentor-review-checklist.entity';

@Injectable()
export class MentorReviewChecklistRepository {
  constructor() {}

  createMentorReviewChecklist(
    entityManager: EntityManager,
    mentorReviewId: number,
    createMentorReviewChecklistRequestBodyDto: CreateMentorReviewChecklistRequestBodyDto,
  ) {
    return entityManager.getRepository(MentorReviewChecklist).save({
      mentorReviewId,
      ...new CreateMentorReviewChecklistRequestBodyDto(
        createMentorReviewChecklistRequestBodyDto,
      ),
    });
  }

  patchUpdateMentorReviewChecklist(
    entityManager: EntityManager,
    mentorReviewId: number,
    patchUpdateMentorReviewChecklist: CreateMentorReviewChecklistRequestBodyDto,
  ) {
    return entityManager.getRepository(MentorReviewChecklist).update(
      {
        mentorReviewId,
      },
      { ...patchUpdateMentorReviewChecklist },
    );
  }

  removeMentorReviewChecklist(
    entityManager: EntityManager,
    mentorReviewId: number,
  ) {
    return entityManager
      .getRepository(MentorReviewChecklist)
      .update({ mentorReviewId }, { deletedAt: new Date() });
  }
}
