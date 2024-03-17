import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TotalCountRepository } from '@src/total-count/repositories/total-count.repository';
import { EntityManager } from 'typeorm';

@Injectable()
export class TotalCountService {
  constructor(private readonly totalCountRepository: TotalCountRepository) {}

  async createTotalCount(entityManager: EntityManager, userId: number) {
    await this.totalCountRepository.createTotalCount(entityManager, userId);
  }

  async createMentorReviewChecklistCount(
    entityManager: EntityManager,
    userId: number,
  ) {
    await this.totalCountRepository.createMentorReviewChecklistCount(
      entityManager,
      userId,
    );
  }

  getMentorBoardAndReviewCount(userId: number) {
    return this.totalCountRepository.getMentorBoardAndReviewCount(userId);
  }

  @Cron('0 0 9 * * 1') // 매주 월요일 오전 9시에 실행
  async clear7DaysCount() {
    const clear = await this.totalCountRepository.clear7DaysCount();

    if (!clear.affected) {
      throw new HttpException(
        '7일 카운트 초기화 실패',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    console.log('7일 카운트 초기화 성공');
  }

  getMentorBoardAndReviewAndBadgeCount(userId: number) {
    return this.totalCountRepository.getMentorBoardAndReivewAndBadgeCount(
      userId,
    );
  }
}
