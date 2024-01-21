import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateMentorReviewChecklistRequestBodyDto } from '../dtos/create-mentor-review-checklist-request-body.dto';
import { MentorReviewChecklist } from '../entities/mentor-review-checklist.entity';
import { MentorReview } from '../entities/mentor-review.entity';

@Injectable()
export class MentorsRepository {
  constructor(private readonly entityManager: EntityManager) {}

  createMentorReview(mentorId: number, menteeId: number, review?: string) {
    return this.entityManager.getRepository(MentorReview).save({
      mentorId,
      menteeId,
      review,
    });
  }

  createMentorReviewChecklist(
    mentorReviewId: number,
    createMentorReviewChecklistRequestBodyDto: CreateMentorReviewChecklistRequestBodyDto,
  ) {
    this.entityManager.getRepository(MentorReviewChecklist).save({
      mentorReviewId,
      ...createMentorReviewChecklistRequestBodyDto,
    });
  }
}
