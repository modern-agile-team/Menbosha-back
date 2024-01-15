import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TotalCountRepository } from '../repositories/total-count.repository';

@Injectable()
export class TotalCountService {
  constructor(private readonly totalCountRepository: TotalCountRepository) {}

  async createTotalCount(userId: number) {
    await this.totalCountRepository.createTotalCount(userId);
  }

  async counting(
    userId: number,
    mentorId: number,
    type: string,
    action: 'increment' | 'decrement',
  ) {
    try {
      if (type === 'countMentorBoardLike' || type === 'countReview') {
        await this.totalCountRepository.counting(mentorId, type, action);
      } else {
        await this.totalCountRepository.counting(userId, type, action);
      }
      return { message: '카운팅 성공' };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        '카운팅 도중 에러가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async syncTotalCount() {
    const userIds = await this.totalCountRepository.getAllUserId();

    for (const userId of userIds) {
      await this.syncTotalCountById(userId);
    }
  }

  async syncTotalCountById(userId: number) {
    const mentorBoardCount =
      await this.totalCountRepository.getMentorBoardCount(userId);
    const helpYouCommentCount =
      await this.totalCountRepository.getHelpYouCommentCount(userId);
    const mentorBoardLikeCount = 0;
    // await this.totalCountRepository.getMentorBoardLikeCount(userId);
    const badgeCount = await this.totalCountRepository.getbadgeCount(userId);
    const reviewCount = await this.totalCountRepository.getReviewCount(userId);

    return await this.totalCountRepository.syncTotalCount(
      userId,
      mentorBoardCount,
      helpYouCommentCount,
      mentorBoardLikeCount,
      badgeCount,
      reviewCount,
    );
  }
}
