import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MentorBoardLike } from '../entities/mentor-board-like.entity';
import { MentorBoardService } from 'src/boards/services/mentor.board.service';
import { LikesService } from 'src/like/services/likes.service';
import { MentorBoardLikeDto } from '../dto/mentorBoard/mentor-board-like.dto';
import { DataSource } from 'typeorm';
import { MentorBoardHotPostsService } from './mentor-board-hot-posts.service';

@Injectable()
export class MentorBoardLikeService {
  constructor(
    private readonly likesService: LikesService<MentorBoardLike>,
    private readonly dataSource: DataSource,
    private readonly mentorBoardService: MentorBoardService,
    private readonly mentorBoardHotPostService: MentorBoardHotPostsService,
  ) {}

  async createMentorBoardLikeAndHotPost(
    mentorBoardId: number,
    userId: number,
  ): Promise<MentorBoardLikeDto> {
    const existBoard = await this.mentorBoardService.findOneByOrNotFound({
      select: {
        id: true,
        userId: true,
        mentorBoardLikes: {
          id: true,
          userId: true,
        },
        popularAt: true,
      },
      where: { id: mentorBoardId },
      relations: ['mentorBoardLikes'],
    });

    if (existBoard.userId === userId) {
      throw new ForbiddenException(
        '본인의 게시글에는 좋아요를 누를 수 없습니다.',
      );
    }

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
      queryRunner.data.existBoard = { ...existBoard };

      const entityManager = queryRunner.manager;

      const newLike = await this.likesService.createLikeWithEntityManager(
        entityManager,
        existBoard.id,
        userId,
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

  async deleteMentorBoardLike(
    mentorBoardId: number,
    userId: number,
  ): Promise<{ isLike: false }> {
    const existBoard = await this.mentorBoardService.findOneByOrNotFound({
      select: {
        id: true,
        mentorBoardLikes: {
          id: true,
        },
        popularAt: true,
      },
      where: { id: mentorBoardId },
      relations: ['mentorBoardLikes'],
    });

    const existLike = await this.likesService.isExistLike(
      existBoard.id,
      userId,
    );

    if (!existLike) {
      throw new ConflictException('아직 좋아요가 존재하지 않습니다.');
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

      if (likeCount === 9 && existBoard.popularAt) {
        await this.mentorBoardHotPostService.deleteMentorBoardHotPost(
          entityManager,
          existBoard.id,
        );
      }

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
