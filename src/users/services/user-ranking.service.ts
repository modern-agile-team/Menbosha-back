import { Cron } from '@nestjs/schedule';
import { UserRankingRepository } from './../repositories/user-ranking.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class UserRankingService {
  constructor(private readonly userRankingRepository: UserRankingRepository) {}

  async getUserRanking() {
    try {
      return await this.userRankingRepository.getUserRanking();
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
            user.countMentorBoard7days * 23 +
            user.countMentorBoardLike7days * 10 +
            user.countHelpYouComment7days * 7 +
            user.countReview7days * 97 +
            user.countBadge7days * 18;

          if (user.countMentorBoard7days > 10) {
            const after = user.countMentorBoard7days - 10;
            totalScore = totalScore - after * 13;
          }
          if (user.countHelpYouComment7days > 20) {
            const after = user.countHelpYouComment7days - 20;
            totalScore = totalScore - after * 4;
          }
          if (user.countReview7days > 5) {
            const after = user.countReview7days - 5;
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

      return { message: '랭킹 업데이트 성공' };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        '랭킹 업데이트 중 에러가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
