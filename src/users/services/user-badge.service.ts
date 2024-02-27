import { Injectable } from '@nestjs/common';
import { MentorReviewChecklistCountsService } from '@src/total-count/services/mentor-review-checklist-counts.service';
import { UserBadgeRepository } from '@src/users/repositories/user-badge.repository';

@Injectable()
export class UserBadgeService {
  constructor(
    private readonly userBadgeRepository: UserBadgeRepository,
    private readonly mentorReviewCountService: MentorReviewChecklistCountsService,
  ) {}

  async checkUserBadges(userId: number): Promise<any> {
    // 내 뱃지 확인하고 내 리뷰 카운트 정보 불러오기.
    // 카운트가 5,10,25,50,100이상일때의 로직 수행하기.

    // 1. 내 뱃지 확인
    const userBadges = await this.userBadgeRepository.findUserBadges(userId);

    // 2. 유저의 리뷰 카운트 불러오기
    const mentorReviewCount =
      await this.mentorReviewCountService.findOneMentorReviewChecklistCountOrFail(
        userId,
      );

    // 3.뱃지 리스트 DB 정보 불러오기
    const badgeList = await this.userBadgeRepository.getBadgeList();
    const newBadges = [];

    //아래 switch 문 각자의 역할별로 나누기

    for (const badge of badgeList) {
      //예외처리 - 이미 내 뱃지에서 있는 case 건너뛰기
      if (!userBadges.some((b) => b.badgeId === badge.id)) {
        let acquisition = false;

        switch (badge.id) {
          case 1: // 친절한 멘토씨 뱃지 - 친절해요 5
            acquisition = mentorReviewCount.isKindnessCount >= 5;
            break;
          case 2: // 가는 말이 좋아야 뱃지 - 친절해요 10
            acquisition = mentorReviewCount.isKindnessCount >= 10;
            break;
          case 3: // 친절해요 25
            acquisition = mentorReviewCount.isKindnessCount >= 25;
            break;
          case 4: // 친절해요 50
            acquisition = mentorReviewCount.isKindnessCount >= 50;
            break;
          case 5: // 친절해요 100
            acquisition = mentorReviewCount.isKindnessCount >= 100;
            break;
          case 6: // 잘 가르쳐줘요 5
            acquisition = mentorReviewCount.isGoodWorkCount >= 5;
            break;
          case 7: // 잘 가르쳐줘요 10
            acquisition = mentorReviewCount.isGoodWorkCount >= 10;
            break;
          case 8: // 잘 가르쳐줘요 25
            acquisition = mentorReviewCount.isGoodWorkCount >= 25;
            break;
          case 9: // 잘 가르쳐줘요 50
            acquisition = mentorReviewCount.isGoodWorkCount >= 50;
            break;
          case 10: // 잘 가르쳐줘요 100
            acquisition = mentorReviewCount.isGoodWorkCount >= 100;
            break;
          case 11: // 깔끔해요 5
            acquisition = mentorReviewCount.isClearCount >= 5;
            break;
          case 12: // 깔끔해요 10
            acquisition = mentorReviewCount.isClearCount >= 10;
            break;
          case 13: // 깔끔해요 25
            acquisition = mentorReviewCount.isClearCount >= 25;
            break;
          case 14: // 깔끔해요 50
            acquisition = mentorReviewCount.isClearCount >= 50;
            break;
          case 15: // 깔끔해요 100
            acquisition = mentorReviewCount.isClearCount >= 100;
            break;
          case 16: // 답변이 빨라요 5
            acquisition = mentorReviewCount.isQuickCount >= 5;
            break;
          case 17: // 답변이 빨라요 10
            acquisition = mentorReviewCount.isQuickCount >= 10;
            break;
          case 18: // 답변이 빨라요 25
            acquisition = mentorReviewCount.isQuickCount >= 25;
            break;
          case 19: // 답변이 빨라요 50
            acquisition = mentorReviewCount.isQuickCount >= 50;
            break;
          case 20: // 답변이 빨라요 100
            acquisition = mentorReviewCount.isQuickCount >= 100;
            break;
          case 21: // 정확해요 5
            acquisition = mentorReviewCount.isAccurateCount >= 5;
            break;
          case 22: // 정확해요 10
            acquisition = mentorReviewCount.isAccurateCount >= 10;
            break;
          case 23: // 정확해요 25
            acquisition = mentorReviewCount.isAccurateCount >= 25;
            break;
          case 24: // 정확해요 50
            acquisition = mentorReviewCount.isAccurateCount >= 50;
            break;
          case 25: // 정확해요 100
            acquisition = mentorReviewCount.isAccurateCount >= 100;
            break;
          case 26: // 이해가 잘돼요 5 -아직
            acquisition = mentorReviewCount.isUnderstandWellCount >= 5;
            break;
          case 27: // 이해가 잘돼요 10
            acquisition = mentorReviewCount.isUnderstandWellCount >= 10;
            break;
          case 28: // 이해가 잘돼요 25
            acquisition = mentorReviewCount.isUnderstandWellCount >= 25;
            break;
          case 29: // 이해가 잘돼요 50
            acquisition = mentorReviewCount.isUnderstandWellCount >= 50;
            break;
          case 30: // 이해가 잘돼요 100
            acquisition = mentorReviewCount.isUnderstandWellCount >= 100;
            break;
          case 31: // 재밌어요 5
            acquisition = mentorReviewCount.isFunCount >= 5;
            break;
          case 32: // 재밌어요 10
            acquisition = mentorReviewCount.isFunCount >= 10;
            break;
          case 33: // 재밌어요 25
            acquisition = mentorReviewCount.isFunCount >= 25;
            break;
          case 34: // 재밌어요 50
            acquisition = mentorReviewCount.isFunCount >= 50;
            break;
          case 35: // 재밌어요 100
            acquisition = mentorReviewCount.isFunCount >= 100;
            break;
          case 36: // 알차요 5
            acquisition = mentorReviewCount.isInformativeCount >= 5;
            break;
          case 37: // 알차요 10
            acquisition = mentorReviewCount.isInformativeCount >= 10;
            break;
          case 38: // 알차요 25
            acquisition = mentorReviewCount.isInformativeCount >= 25;
            break;
          case 39: // 알차요 50
            acquisition = mentorReviewCount.isInformativeCount >= 50;
            break;
          case 40: // 알차요 100
            acquisition = mentorReviewCount.isInformativeCount >= 100;
            break;
        }

        if (acquisition) {
          newBadges.push({ userId: Number(userId), badgeId: badge.id });
        }
      }
    }

    // 새롭게 획득한 뱃지 추가. 기존의 userBadge와 새로 획득한 acquiredBadges 리턴
    if (newBadges.length > 0) {
      const acquiredBadges =
        await this.userBadgeRepository.createNewBadges(newBadges);

      return [userBadges, { acquiredBadges }];
    }
    //새로 획득한 뱃지가 없을 경우 기존의 userBadge 리턴
    return userBadges;
  }
}
