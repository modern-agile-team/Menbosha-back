import { Injectable } from '@nestjs/common';
import { UserBadgeRepository } from '../repositories/user-badge.repository';
import { MentorReviewChecklistCountRepository } from 'src/total-count/repositories/mentor-review-checklist-count.repository';

@Injectable()
export class UserBadgeService {
  constructor(
    private readonly userBadgeRepository: UserBadgeRepository,
    private readonly mentorReviewCountRepository: MentorReviewChecklistCountRepository,
  ) {}

  async checkUserBadge(userId: number): Promise<any> {
    console.log(userId);
  }
}
