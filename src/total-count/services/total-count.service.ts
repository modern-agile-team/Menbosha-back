import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TotalCountRepository } from '../repositories/total-count.repository';
import { Type } from '../enums/type.enum';
import { Action } from '../enums/action.enum';
import { Cron } from '@nestjs/schedule';
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

  async counting(userId: number, mentorId: number, type: Type, action: Action) {
    try {
      if (type === Type.MentorBoardLikeCount || type === Type.ReviewCount) {
        if (!mentorId) {
          throw new HttpException(
            'mentorId가 필요한 요청입니다.',
            HttpStatus.BAD_REQUEST,
          );
        }
        await this.totalCountRepository.counting(mentorId, type, action);
      } else {
        await this.totalCountRepository.counting(userId, type, action);
      }
      return { message: '카운팅 성공' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else {
        console.log(error);
        throw new HttpException(
          '카운팅 도중 에러가 발생했습니다.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
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
}
