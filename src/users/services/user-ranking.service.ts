import { UserRankingRepository } from './../repositories/user-ranking.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRankingService {
  constructor(private readonly userRankingRepository: UserRankingRepository) {}

  async filteredUsers() {
    const usersId = await this.userRankingRepository.getAllUserId();

    const checkUsers = await Promise.all(
      usersId.map(async (userId) => {
        const countMentorBoard =
          await this.userRankingRepository.countMentorBoard(userId);
        const countHelpYouComment =
          await this.userRankingRepository.countHelpYouComment(userId);
        // const checkBoardLikeNum =
        //   await this.userRankingRepository.checkBoardLikeNum(userId);
        const countUserReivew =
          await this.userRankingRepository.countUserReview(userId);

        if (
          countMentorBoard > 1 ||
          countHelpYouComment > 2 ||
          countUserReivew > 0
        ) {
          return {
            userId,
            countMentorBoard,
            countHelpYouComment,
            countUserReivew,
            rank: 0,
            countBadge: 0,
            totalScore: 0,
          };
        }
        return null;
      }),
    );

    const filteredUsers = checkUsers.filter((user) => user !== null);

    for (const user of filteredUsers) {
      const rank = await this.userRankingRepository.getUserRank(user.userId);
      const countBadge = await this.userRankingRepository.countBadge(
        user.userId,
      );

      user.rank = rank;
      user.countBadge = countBadge;
    }

    return filteredUsers;
  }

  async userRanking() {
    const filteredUsers = await this.filteredUsers();

    filteredUsers.map((user) => {
      user.totalScore =
        user.countMentorBoard * 23 +
        user.countHelpYouComment * 7 +
        user.countUserReivew * 97 +
        user.countBadge * 18 +
        user.rank;

      if (user.countMentorBoard > 10) {
        const after = user.countMentorBoard - 10;
        user.totalScore = user.totalScore - after * 13;
      }
      if (user.countHelpYouComment > 20) {
        const after = user.countHelpYouComment - 20;
        user.totalScore = user.totalScore - after * 4;
      }
      if (user.countUserReivew > 5) {
        const after = user.countUserReivew - 5;
        user.totalScore = user.totalScore + after * 49;
      }
    });

    const sortedUsers = filteredUsers.sort((a, b) => {
      return b.totalScore - a.totalScore;
    });

    // totalScore가 60점 이상인 유저만 뽑아서 1~10위까지만 뽑아서 리턴
    const topTenUsers = sortedUsers.filter((user) => user.totalScore >= 60);
    const topTenUsersRanking = topTenUsers.slice(0, 10);

    return topTenUsersRanking;
  }
}
