import { Cron } from '@nestjs/schedule';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRankingRepository } from '@src/users/repositories/user-ranking.repository';
import { MentorReviewChecklistCountsService } from '@src/total-count/services/mentor-review-checklist-counts.service';
import { TotalCountService } from '@src/total-count/services/total-count.service';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserRankingService {
  constructor(
    private readonly userRankingRepository: UserRankingRepository,
    private readonly mentorReviewCountService: MentorReviewChecklistCountsService,
    private readonly totalCountService: TotalCountService,
    private readonly userRepository: UserRepository,
  ) {}

  async getUserRanking() {
    try {
      const userRanking = await this.userRankingRepository.getUserRanking();
      return { userRanking };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        '랭킹을 불러오는 중 에러가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Cron('0 59 8 * * 1') // 매주 월요일 오전 8시 59분에 실행 (7days 칼럼 초기화 전에 실행)
  async saveUserRanking() {
    try {
      const allUserCounts = await this.userRankingRepository.allUserCounts();
      const userRankingArray = allUserCounts
        .map((user) => {
          let totalScore =
            user.mentorBoardCountInSevenDays * 23 +
            user.mentorBoardLikeCountInSevenDays * 10 +
            user.helpYouCommentCountInSevenDays * 7 +
            user.reviewCountInSevenDays * 97 +
            user.badgeCountInSevenDays * 18;

          if (user.mentorBoardCountInSevenDays > 10) {
            const after = user.mentorBoardCountInSevenDays - 10;
            totalScore = totalScore - after * 13;
          }
          if (user.helpYouCommentCountInSevenDays > 20) {
            const after = user.helpYouCommentCountInSevenDays - 20;
            totalScore = totalScore - after * 4;
          }
          if (user.reviewCountInSevenDays > 5) {
            const after = user.reviewCountInSevenDays - 5;
            totalScore = totalScore + after * 49;
          }
          if (totalScore < 60) {
            return null;
          }
          return {
            userId: user.userId,
            totalScore,
          };
        })
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 10);

      const userIds = userRankingArray.map((user) => user.userId);
      while (userIds.length < 10) {
        userIds.push(null);
      }

      await this.userRankingRepository.saveUserRanking(userIds);

      for (const userId of userIds) {
        if (userId === null) {
          break;
        }
        await this.userRankingRepository.saveUserInfo(userId);
      }

      console.log('랭킹 업데이트 성공');
    } catch (error) {
      console.log(error);
      throw new HttpException(
        '랭킹 업데이트 중 에러가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Cron('0 0 * * * *') // 1시간마다 실행
  async updateUserRankingInfo() {
    const userIdsArray = (
      await this.userRankingRepository.findUserIdsByUserRanking()
    ).map((user) => user.userId);

    for (const userId of userIdsArray) {
      if (userId === null) {
        break;
      }
      await this.userRankingRepository.saveUserInfo(userId);
    }

    console.log('랭킹 정보 업데이트 성공');
  }

  @Cron('0 58 8 * * 1') // 매주 월요일 오전 8시 58분에 실행 (유저 랭킹 저장 전에 실행)
  async clearUserRanking() {
    try {
      await this.userRankingRepository.clearUserRanking();
      console.log('랭킹 초기화 성공');
    } catch (error) {
      console.log(error);
      throw new HttpException(
        '랭킹 초기화 중 에러가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkUserRank(userId: number): Promise<any> {
    // 내 랭크 확인
    const myRank = await this.userRepository.getUserRank(userId);

    // 유저의 리뷰 카운트 불러오기
    const mentorReviewCount =
      await this.mentorReviewCountService.findOneMentorReviewChecklistCountOrFail(
        userId,
      );

    const baseRank = 15; //기본 점수

    //유저 리뷰 카운트에 따라 랭크 +- 점수부여
    const rank =
      mentorReviewCount.isGoodWorkCount * 8 +
      mentorReviewCount.isClearCount * 8 +
      mentorReviewCount.isQuickCount * 8 +
      mentorReviewCount.isAccurateCount * 8 +
      mentorReviewCount.isKindnessCount * 8 +
      mentorReviewCount.isInformativeCount * 8 +
      mentorReviewCount.isUnderstandWellCount * 8 -
      mentorReviewCount.isBadCount * 5 -
      mentorReviewCount.isStuffyCount * 5 +
      baseRank;

    const newRank = await this.userRepository.updateMyRank(userId, rank);

    return { myRank: myRank, newRank: newRank };
  }
}
