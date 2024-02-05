import { Injectable } from '@nestjs/common';
import { MentorReviewChecklistRepository } from '../repositories/mentor-review-checklists.repository';
import { CreateMentorReviewChecklistRequestBodyDto } from 'src/mentors/mentor-reviews/dtos/create-mentor-review-checklist-request-body.dto';
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
    return this.mentorReviewChecklistRepository.createMentorReviewChecklist(
      entityManager,
      mentorReviewId,
      { ...createMentorReviewChecklistRequestBodyDto },
    );
  }

  patchUpdateMentorReviewChecklist(
    entityManager: EntityManager,
    mentorReviewId: number,
    patchUpdateMentorReviewChecklist: CreateMentorReviewChecklistRequestBodyDto,
  ) {
    return this.mentorReviewChecklistRepository.patchUpdateMentorReviewChecklist(
      entityManager,
      mentorReviewId,
      { ...patchUpdateMentorReviewChecklist },
    );
  }

  removeMentorReviewChecklist(
    entityManager: EntityManager,
    mentorReviewId: number,
  ) {
    return this.mentorReviewChecklistRepository.removeMentorReviewChecklist(
      entityManager,
      mentorReviewId,
    );
  }
}
