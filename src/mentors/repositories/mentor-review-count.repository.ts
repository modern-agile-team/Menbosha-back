import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { MentorReviewChecklist } from '../entities/mentor-review-checklist.entity';

@Injectable()
export class MentorReviewCountRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async getReviewCount(mentorId: number): Promise<number> {
    const count = await this.entityManager.count(MentorReviewChecklist, {
      where: { mentorReview: { mentorId }, isGoodWork: true }, // mentorId에 해당하는 멘토 리뷰 중 isGoodWork가 true인 체크리스트의 수를 세기
    });
    return count;
  }
}
