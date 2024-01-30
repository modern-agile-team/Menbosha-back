import { Injectable } from '@nestjs/common';
import { UserBadgeRepository } from '../repositories/user-badge.repository';
import { TotalCountRepository } from 'src/total-count/repositories/total-count.repository';

@Injectable()
export class UserBadgeService {
  constructor(
    private readonly userBadgeRepository: UserBadgeRepository,
    private readonly totalCountRepository: TotalCountRepository,
  ) {}
  async countBadge(
    userId: number,
    mentorId: number,
    category: string,
  ): Promise<string> {
    try {
      let badgeMessage = '뱃지 획득에 실패했습니다.';

      switch (category) {
        case 'board':
          const boardBadge = await this.checkAndAwardBoardBadge(userId);
          if (boardBadge) {
            badgeMessage = `게시글 뱃지 획득에 성공했습니다. (${boardBadge.name})`;
          }
          break;
        case 'comment':
          const commentBadge = await this.checkAndAwardCommentBadge(userId);
          await this.totalCountRepository.countComments(userId);
          // 댓글 뱃지에 대한 로직 추가
          break;
        case 'like':
          await this.totalCountRepository.countLikes(userId);
          // 좋아요 뱃지에 대한 로직 추가
          break;
        case 'review':
          await this.totalCountRepository.countReviews(userId);
          // 리뷰 뱃지에 대한 로직 추가
          break;
        default:
          throw new Error('유효하지 않은 카테고리');
      }

      return badgeMessage;
    } catch (error) {
      throw new Error(`뱃지 획득에 실패했습니다. ${error.message}`);
    }
  }

  async checkAndAwardBoardBadge(userId: number) {
    // 게시글 뱃지 여부 확인
    const boardBadges = [1, 2, 3];
    const hasBoardBadge = await this.userBadgeRepository.myBoardBadge(
      userId,
      boardBadges,
    );
    // 게시글 뱃지 획득 로직
    const boardCount = await this.totalCountRepository.countBoards(userId);
    if (boardCount >= 10 && !hasBoardBadge) {
      const boardBadge =
        await this.userBadgeRepository.getBadgeByName('게시글 뱃지');
      await this.userBadgeRepository.createBadge(userId, boardBadge.id);
      // 필요시 추가적인 뱃지 확인 및 획득 로직 추가
      return boardBadge;
    }
    return null;
  }

  async checkAndAwardCommentBadge(userId: number) {
    // 댓글 뱃지 여부 확인
    const hasCommentBadge =
      await this.userBadgeRepository.myCommentBadge(userId);
    // 댓글 뱃지 획득 로직
    const commentCount = await this.totalCountRepository.countComments(userId);
    if (commentCount >= 10 && !hasCommentBadge) {
      const commentBadge =
        await this.userBadgeRepository.getCommentBadge(userId); // 뱃지를 획득할때의 뱃지번호를 하나씩 적어줘야 할까?
    }
  }
}
