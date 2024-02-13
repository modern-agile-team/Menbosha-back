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
    // userId로 획득한 뱃지가 있는지 검사
    const userBadges = await this.userBadgeRepository.findUserBadges(userId);

    // userId로 멘토리뷰카운트 레포에서 리뷰 카운트 확인
    const mentorReviewCount =
      await this.mentorReviewCountRepository.findOneByUserId(userId);

    // 리뷰 카운트에 따라 새로운 뱃지를 부여하고 userBadge에 추가

    // 마무리 후 userId로 검사해서 뱃지 배열로 리턴
    const updatedBadges = await this.userBadgeRepository.findUserBadges(userId);
    return updatedBadges;
  }
}
