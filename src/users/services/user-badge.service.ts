import { Injectable } from '@nestjs/common';
import { UserBadgeRepository } from '../repositories/user-badge.repository';
import { TotalCountRepository } from 'src/total-count/repositories/total-count.repository';

@Injectable()
export class UserBadgeService {
  constructor(
    private readonly userBadgeRepository: UserBadgeRepository,
    private readonly totalCountRepository: TotalCountRepository,
  ) {}
  async countBadge(userId: number, category: string): Promise<string> {
    console.log(category);

    try {
      switch (category) {
        case 'mentorBoard':
          const mentorBoardBadge = await this.checkAndAwardBoardBadge(userId);
          if (mentorBoardBadge) {
            // console.log(`새로운 뱃지가 있습니다! (${mentorBoardBadge.name})`);
          }
          break;
        case 'helpMeBoard':
          const helpMeBoardBadge = await this.checkAndAwardBoardBadge(userId);
          if (helpMeBoardBadge) {
            // console.log(`새로운 뱃지가 있습니다! (${helpMeBoardBadge.name})`);
          }
          break;
        // case 'comment':
        //   const commentBadge = await this.checkAndAwardCommentBadge(userId);
        //   if (commentBadge) {
        //     console.log(`새로운 뱃지가 있습니다! (${commentBadge.name})`);
        //   }
        //   break;
        // case 'like':
        //   const likeBadge = await this.checkAndAwardLikeBadge(userId);
        //   if (likeBadge) {
        //     console.log(`새로운 뱃지가 있습니다! (${likeBadge.name})`);
        //   }
        //   break;
        // case 'review':
        //   const reviewBadge = await this.checkAndAwardReviewBadge(userId);
        //   if (reviewBadge) {
        //     console.log(`새로운 뱃지가 있습니다! (${reviewBadge.name})`);
        //   }
        //   break;
        default:
          throw new Error('유효하지 않은 카테고리');
      }
    } catch (error) {
      throw new Error(`뱃지 획득에 실패했습니다. ${error.message}`);
    }
    return undefined;
  }

  async checkAndAwardBoardBadge(userId: number) {
    // 게시글 뱃지 여부 확인
    const mentorBoardBadges = [1, 2, 3]; //enum 으로 관리. (명시적으로 변경)
    const hasBoardBadge = await this.userBadgeRepository.myMentorBoardBadge(
      //hasBoardBadge 가 3개임 시발 - > boardCount가 10이고, hasBoardBadge.id 가 1이 없을 때.
      // 이것또한 switch case로 해본다?
      userId,
      mentorBoardBadges,
    );
    // 게시글 뱃지 획득 로직
    const boardCount = await this.totalCountRepository.countBoards(userId);
    switch (boardCount) {
      case 10:
        if (hasBoardBadge.length === 0) {
          const badgeId = 1;
          const boardBadge = await this.userBadgeRepository.addMentorBoardBadge(
            userId,
            badgeId,
          );
          return boardBadge;
        }
        break;

      case 20:
        if (hasBoardBadge.filter((badge) => badge.id === 2).length === 0) {
          const badgeId = 2;
          const boardBadge = await this.userBadgeRepository.addMentorBoardBadge(
            userId,
            badgeId,
          );
          return boardBadge;
        }
        break;

      case 30:
        if (hasBoardBadge.filter((badge) => badge.id === 3).length === 0) {
          const badgeId = 3;
          const boardBadge = await this.userBadgeRepository.addMentorBoardBadge(
            userId,
            badgeId,
          );
          return boardBadge;
        }
        break;

      default:
        throw new Error('에러');
    }
    return undefined;
  }

  // async checkAndAwardCommentBadge(userId: number) {
  //   // 댓글 뱃지 여부 확인
  //   const commentBadges = [10, 11, 12];
  //   const hasCommentBadge = await this.userBadgeRepository.myCommentBadge(
  //     userId,
  //     commentBadges,
  //   );

  //   const commentCount = await this.totalCountRepository.countComments(userId);
  //   switch (commentCount) {
  //     case 10:
  //       if (hasCommentBadge.length === 0) {
  //         const badgeId = 10;
  //         const commentBadge = await this.userBadgeRepository.addCommentBadge(
  //           userId,
  //           badgeId,
  //         );
  //         return commentBadge;
  //       }
  //     case 20:
  //       if (hasCommentBadge.filter((badge) => badge.id === 2).length === 0) {
  //         const badgeId = 20;
  //         const commentBadge = await this.userBadgeRepository.addCommentBadge(
  //           userId,
  //           badgeId,
  //         );
  //         return commentBadge;
  //       }
  //     case 30:
  //       if (hasCommentBadge.filter((badge) => badge.id === 2).length === 0) {
  //         const badgeId = 30;
  //         const commentBadge = await this.userBadgeRepository.addCommentBadge(
  //           userId,
  //           badgeId,
  //         );
  //         return commentBadge;
  //       }
  //   }
  // }
}
