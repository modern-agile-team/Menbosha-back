import { Injectable } from '@nestjs/common';
import { UserBadgeRepository } from '../repositories/user-badge.repository';
import { TotalCountRepository } from 'src/total-count/repositories/total-count.repository';

@Injectable()
export class UserBadgeService {
  constructor(
    private readonly userBadgeRepository: UserBadgeRepository,
    private readonly totalCountRepository: TotalCountRepository,
  ) {}
  // async countBadge(userId: number, category: string): Promise<string> {
  //   console.log(category);

  //   try {
  //     switch (category) {
  //       case 'mentorBoard':
  //         const mentorBoardBadge = await this.checkAndAwardBoardBadge(userId);
  //         if (mentorBoardBadge) {
  //           return `새로운 뱃지가 있습니다! (${mentorBoardBadge.badgeId})`;
  //         }
  //         break;
  //       case 'helpMeBoard':
  //         const helpMeBoardBadge = await this.checkAndAwardBoardBadge(userId);
  //         if (helpMeBoardBadge) {
  //           return `새로운 뱃지가 있습니다! (${helpMeBoardBadge.badgeId})`;
  //         }
  //         break;
  //       case 'comment':
  //         const commentBadge = await this.checkAndAwardCommentBadge(userId);
  //         if (commentBadge) {
  //           return `새로운 뱃지가 있습니다! (${commentBadge.badgeId})`;
  //         }
  //         break;
  //       case 'like':
  //         const likeBadge = await this.checkAndAwardLikeBadge(userId);
  //         if (likeBadge) {
  //           return `새로운 뱃지가 있습니다! (${likeBadge.badgeId})`;
  //         }
  //         break;
  //       case 'review':
  //         const reviewBadge = await this.checkAndAwardReviewBadge(userId);
  //         if (reviewBadge) {
  //           return `새로운 뱃지가 있습니다! (${reviewBadge.badgeId})`;
  //         }
  //         break;
  //       default:
  //         throw new HttpException('유효하지 않은 카테고리', 404);
  //     }
  //   } catch (error) {
  //     throw new HttpException(
  //       `뱃지 획득에 실패했습니다. ${error.message}`,
  //       404,
  //     );
  //   }
  //   return undefined;
  // }

  // async checkAndAwardBoardBadge(userId: number) {
  //   console.log(2);

  //   // 게시글 뱃지 여부 확인
  //   const mentorBoardBadges = [1, 2, 3]; //enum 으로 관리. (명시적으로 변경)
  //   const hasBoardBadge = await this.userBadgeRepository.myMentorBoardBadge(
  //     //hasBoardBadge 가 3개임 시발 - > boardCount가 10이고, hasBoardBadge.id 가 1이 없을 때.
  //     // 이것또한 switch case로 해본다?
  //     userId,
  //     mentorBoardBadges,
  //   );
  //   // 게시글 뱃지 획득 로직
  //   const boardCount = await this.totalCountRepository.countBoards(userId);
  //   console.log(boardCount, hasBoardBadge);

  //   switch (boardCount) {
  //     case 10:
  //       if (hasBoardBadge.length === 0) {
  //         const badgeId = 1;
  //         const boardBadge = await this.userBadgeRepository.addMentorBoardBadge(
  //           userId,
  //           badgeId,
  //         );
  //         return boardBadge;
  //       }
  //       break;

  //     case 20:
  //       if (hasBoardBadge.filter((badge) => badge.id === 2).length === 0) {
  //         const badgeId = 2;
  //         const boardBadge = await this.userBadgeRepository.addMentorBoardBadge(
  //           userId,
  //           badgeId,
  //         );
  //         return boardBadge;
  //       }
  //       break;

  //     case 30:
  //       if (hasBoardBadge.filter((badge) => badge.id === 3).length === 0) {
  //         const badgeId = 3;
  //         const boardBadge = await this.userBadgeRepository.addMentorBoardBadge(
  //           userId,
  //           badgeId,
  //         );
  //         return boardBadge;
  //       }
  //       break;

  //     default:
  //       throw new HttpException('아직 도달하지 못한 뱃지입니다', 404);
  //   }
  //   return undefined;
  // }
  // async checkAndAwardHelpMeBoardBadge(userId: number) {
  //   const helpMeBoardBadges = [1, 2, 3]; //enum 으로 관리. (명시적으로 변경)
  //   const hasBoardBadge = await this.userBadgeRepository.myHelpMeBoardBadge(
  //     //hasBoardBadge 가 3개임 시발 - > boardCount가 10이고, hasBoardBadge.id 가 1이 없을 때.
  //     // 이것또한 switch case로 해본다?
  //     userId,
  //     helpMeBoardBadges,
  //   );
  //   // 게시글 뱃지 획득 로직
  //   const boardCount = await this.totalCountRepository.countBoards(userId);
  //   console.log(boardCount, hasBoardBadge);

  //   switch (boardCount) {
  //     case 10:
  //       if (hasBoardBadge.length === 0) {
  //         const badgeId = 1;
  //         const boardBadge = await this.userBadgeRepository.addHelpMeBoardBadge(
  //           userId,
  //           badgeId,
  //         );
  //         return boardBadge;
  //       }
  //       break;

  //     case 20:
  //       if (hasBoardBadge.filter((badge) => badge.id === 2).length === 0) {
  //         const badgeId = 2;
  //         const boardBadge = await this.userBadgeRepository.addHelpMeBoardBadge(
  //           userId,
  //           badgeId,
  //         );
  //         return boardBadge;
  //       }
  //       break;

  //     case 30:
  //       if (hasBoardBadge.filter((badge) => badge.id === 3).length === 0) {
  //         const badgeId = 3;
  //         const boardBadge = await this.userBadgeRepository.addHelpMeBoardBadge(
  //           userId,
  //           badgeId,
  //         );
  //         return boardBadge;
  //       }
  //       break;

  //     default:
  //       throw new HttpException('아직 도달하지 못한 뱃지입니다', 404);
  //   }
  //   return undefined;
  // }

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

  // async checkAndAwardLikeBadge(userId: number) {
  //   // 댓글 뱃지 여부 확인
  //   const likeBadges = [10, 11, 12];
  //   const hasLikeBadge = await this.userBadgeRepository.myLikeBadge(
  //     userId,
  //     likeBadges,
  //   );

  //   const likeCount = await this.totalCountRepository.countLikes(userId);
  //   switch (likeCount) {
  //     case 7:
  //       if (hasLikeBadge.length === 0) {
  //         const badgeId = 7;
  //         const likeBadge = await this.userBadgeRepository.addLikeBadge(
  //           userId,
  //           badgeId,
  //         );
  //         return likeBadge;
  //       }
  //     case 8:
  //       if (hasLikeBadge.filter((badge) => badge.id === 2).length === 0) {
  //         const badgeId = 8;
  //         const likeBadge = await this.userBadgeRepository.addLikeBadge(
  //           userId,
  //           badgeId,
  //         );
  //         return likeBadge;
  //       }
  //     case 9:
  //       if (hasLikeBadge.filter((badge) => badge.id === 2).length === 0) {
  //         const badgeId = 9;
  //         const likeBadge = await this.userBadgeRepository.addLikeBadge(
  //           userId,
  //           badgeId,
  //         );
  //         return likeBadge;
  //       }
  //   }
  // }

  // async checkAndAwardReviewBadge(userId: number) {
  //   // 댓글 뱃지 여부 확인
  //   const reviewBadges = [10, 11, 12];
  //   const hasReviewBadge = await this.userBadgeRepository.myReviewBadge(
  //     userId,
  //     reviewBadges,
  //   );

  //   const reviewCount = await this.totalCountRepository.countReviews(userId);
  //   switch (reviewCount) {
  //     case 10:
  //       if (hasReviewBadge.length === 0) {
  //         const badgeId = 10;
  //         const reviewBadge = await this.userBadgeRepository.addReviewBadge(
  //           userId,
  //           badgeId,
  //         );
  //         return reviewBadge;
  //       }
  //     case 20:
  //       if (hasReviewBadge.filter((badge) => badge.id === 2).length === 0) {
  //         const badgeId = 20;
  //         const reviewBadge = await this.userBadgeRepository.addReviewBadge(
  //           userId,
  //           badgeId,
  //         );
  //         return reviewBadge;
  //       }
  //     case 30:
  //       if (hasReviewBadge.filter((badge) => badge.id === 2).length === 0) {
  //         const badgeId = 30;
  //         const reviewBadge = await this.userBadgeRepository.addReviewBadge(
  //           userId,
  //           badgeId,
  //         );
  //         return reviewBadge;
  //       }
  //   }
  // }

  async countBadge(mentorId: number): Promise<void> {
    const myBadge = await this.userBadgeRepository.getUserBadge(mentorId);
    const checkBadge = await this.userBadgeRepository.getUserBadge(mentorId);
    console.log(myBadge, checkBadge);
  }
}
