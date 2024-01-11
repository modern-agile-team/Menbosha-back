import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MentorBoardLike } from '../entities/mentor-board-like.entity';
import { MentorBoardService } from 'src/boards/services/mentor.board.service';
import { LikesService } from 'src/like/services/likes.service';
import { HotPostsService } from 'src/hot-posts/services/hot-posts.service';
import { MentorBoardHotPost } from '../entities/mentor-board-hot-post.entity';
import { MentorBoardJoinLikesDto } from '../dto/mentorBoard/mentor-board-join-likes.dto';
import { MentorBoardLikeDto } from '../dto/mentorBoard/mentor-board-like.dto';
import { MentorBoardHotPostsService } from './mentor-board-hot-posts.service';
import { DataSource } from 'typeorm';

@Injectable()
export class MentorBoardLikeService {
  constructor(
    private readonly likesService: LikesService<MentorBoardLike>,
    private readonly hotPostsService: HotPostsService<MentorBoardHotPost>,
    private readonly dataSource: DataSource,
    private readonly mentorBoardService: MentorBoardService,
    private readonly mentorBoardHotPostService: MentorBoardHotPostsService,
  ) {}
  async createMentorBoardLikeAndHotPost(
    boardId: number,
    userId: number,
  ): Promise<MentorBoardLikeDto> {
    const existBoard: MentorBoardJoinLikesDto =
      await this.mentorBoardService.findOneByOrNotFound({
        select: {
          id: true,
          mentorBoardLikes: {
            id: true,
          },
        },
        where: { id: boardId },
        relations: ['mentorBoardLikes'],
      });

    if (
      existBoard.mentorBoardLikes.find(
        (mentorBoardLike) => mentorBoardLike.userId === userId,
      )
    ) {
      throw new ConflictException('이미 좋아요가 존재합니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const newLike = await this.likesService.createLikeWithEntityManager(
        entityManager,
        existBoard.id,
        userId,
      );

      const likeCount = existBoard.mentorBoardLikes.length + 1;

      await this.mentorBoardHotPostService.createMentorBoardHotPostOrIncrease(
        entityManager,
        existBoard.id,
        likeCount,
      );

      await queryRunner.commitTransaction();

      return new MentorBoardLikeDto(newLike);
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      console.error(error);

      throw new InternalServerErrorException('좋아요 생성 중 서버 에러 발생');
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }

  /**
   * @todo hot posts service와 분리 및 에러 핸들링
   */
  async deleteMentorBoardLike(
    boardId: number,
    userId: number,
  ): Promise<{ isLike: false }> {
    const existBoard: MentorBoardJoinLikesDto =
      await this.mentorBoardService.findOneByOrNotFound({
        where: { id: boardId },
        relations: ['mentorBoardLikes'],
      });

    if (
      !existBoard.mentorBoardLikes.find(
        (mentorBoardLike) => mentorBoardLike.userId === userId,
      )
    ) {
      throw new ConflictException('이미 좋아요가 없습니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      await this.likesService.deleteLikeWithEntityManager(
        entityManager,
        existBoard.id,
        userId,
      );

      const likeCount = existBoard.mentorBoardLikes.length - 1;

      await this.mentorBoardHotPostService.deleteMentorBoardHotPostOrDecrease(
        entityManager,
        existBoard.id,
        likeCount,
      );

      await queryRunner.commitTransaction();

      return { isLike: false };
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      console.error(error);

      throw new InternalServerErrorException('좋아요 삭제 중 서버 에러 발생');
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }
}
