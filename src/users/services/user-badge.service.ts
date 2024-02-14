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
    console.log(userBadges);

    // userId로 멘토리뷰카운트 레포에서 리뷰 카운트 확인
    // const mentorReviewCount =
    // await this.mentorReviewCountRepository.findOneByUserId(userId);
    // console.log(mentorReviewCount);

    // // 리뷰 카운트에 따라 새로운 뱃지를 부여하고 userBadge에 추가
    // const newBadges = [];
    // if (mentorReviewCount) {
    //   const reviewCount = Object.values(mentorReviewCount).reduce(
    //     (total, count) => total + count,
    //     0,
    //   );
    //   if (reviewCount >= 100 && !userBadges.includes('다이아뱃지')) {
    //     newBadges.push('다이아뱃지');
    //   }
    //   if (reviewCount >= 50 && !userBadges.includes('플레티넘뱃지')) {
    //     newBadges.push('플레티넘뱃지');
    //   }
    //   if (reviewCount >= 25 && !userBadges.includes('골드뱃지')) {
    //     newBadges.push('골드뱃지');
    //   }
    //   if (reviewCount >= 10 && !userBadges.includes('실버뱃지')) {
    //     newBadges.push('실버뱃지');
    //   }
    //   if (reviewCount >= 5 && !userBadges.includes('브론즈뱃지')) {
    //     newBadges.push('브론즈뱃지');
    //   }
    // }

    // // 새로운 뱃지를 userBadge에 추가
    // await this.userBadgeRepository.addUserBadges(userId, newBadges);

    // 마무리 후 userId로 검사해서 뱃지 배열로 리턴
    // const updatedBadges = await this.userBadgeRepository.findUserBadges(userId);
    // return updatedBadges;
  }
}
