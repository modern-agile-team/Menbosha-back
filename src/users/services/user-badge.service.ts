import { Injectable } from '@nestjs/common';
import { UserBadgeRepository } from '../repositories/user-badge.repository';
import { TotalCountRepository } from 'src/total-count/repositories/total-count.repository';

@Injectable()
export class UserBadgeService {
  constructor(
    private readonly userBadgeRepository: UserBadgeRepository,
    private readonly totalCountRepository: TotalCountRepository,
  ) {}

  async userBadge(userId: number) {
    return await this.userBadgeRepository.getUserBadge(userId);
  }

  async countBoard(userId: number) {
    return await this.totalCountRepository.countBoards(userId);
  }

  async countComment(userId: number) {
    return await this.totalCountRepository.countComments(userId);
  }

  async countLikes(userId: number) {
    return await this.totalCountRepository.countLikes(userId);
  }

  async countReview(mentorId: number) {
    return await this.totalCountRepository.countReviews(mentorId);
  }

  async countBadge(userId: number, mentorId: number, category: string) {
    if (category === 'board') {
      await this.countBoard(userId);
      // const countBoard = await this.totalCountRepository.countBoards(userId); // 획득조건: 게시글 몇개 인지
    } else if (category === 'comment') {
      await this.countComment(userId);
      // const countComment =
      //   await this.totalCountRepository.countComments(userId); // 획득조건: 댓글이 몇개 인지
    } else if (category === 'like') {
      await this.countLikes(userId);
      // const likesCount = await this.totalCountRepository.countLikes(userId); // 획득조건: 게시물의 좋아요 수가 몇개인지.
    } else if (category === 'review') {
      await this.countReview(mentorId);
    }
    //1번째 예외처리 - 어떠한 요청인가

    const myBadge = await this.userBadgeRepository.getUserBadge(userId); // 내 뱃지 종류 불러와야함

    // 예외처리(조건) 보드생성, 댓글생성, 좋아요 개수 / 근데 그 전에 내가 이미 획득한 뱃지인지 판별해야함.
    if (countBoard >= 10) {
    }
    if (countComment >= 10) {
    }
    return { countBoard, countComment };
  }
}
