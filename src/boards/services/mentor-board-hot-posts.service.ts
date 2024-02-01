import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { MentorBoard } from '../entities/mentor-board.entity';
import { HotPostsRepository } from 'src/hot-posts/repositories/hot-posts.repository';

@Injectable()
export class MentorBoardHotPostsService {
  constructor(
    private readonly hotPostsRepository: HotPostsRepository<MentorBoard>,
  ) {}

  async createMentorBoardHotPost(
    entityManager: EntityManager,
    mentorBoardId: number,
  ): Promise<void> {
    const updateResult = await this.hotPostsRepository.updateToHotPost(
      entityManager,
      mentorBoardId,
    );

    if (!updateResult.affected) {
      throw new InternalServerErrorException(
        '멘토 게시글 업데이트 중 서버 에러 발생',
      );
    }

    return;
  }

  async deleteMentorBoardHotPost(
    entityManager: EntityManager,
    mentorBoardId: number,
  ): Promise<void> {
    const updateResult = await this.hotPostsRepository.updateToNotHotPost(
      entityManager,
      mentorBoardId,
    );

    if (!updateResult.affected) {
      throw new InternalServerErrorException(
        '멘토 게시글 업데이트 중 서버 에러 발생',
      );
    }

    return;
  }
}
