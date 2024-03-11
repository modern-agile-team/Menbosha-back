import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MentorBoardLikeDto } from '@src/boards/dto/mentorBoard/mentor-board-like.dto';
import { MentorBoardService } from '@src/boards/services/mentor.board.service';
import { MentorBoard } from '@src/entities/MentorBoard';
import { MentorBoardLike } from '@src/entities/MentorBoardLike';
import { LikesService } from '@src/like/services/likes.service';
import { DataSource } from 'typeorm';
@Injectable()
export class MentorBoardLikeService {
  constructor(
    private readonly likesService: LikesService<MentorBoardLike>,
    private readonly dataSource: DataSource,
    private readonly mentorBoardService: MentorBoardService,
  ) {}

  async createMentorBoardLikeAndHotPost(
    mentorBoardId: number,
    userId: number,
  ): Promise<MentorBoardLikeDto> {
    const existBoard = (await this.mentorBoardService.findOneByOrNotFound({
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
    })) as MentorBoard;

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
        userId: true,
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
      queryRunner.data.existBoard = { ...existBoard };

      const entityManager = queryRunner.manager;

      await this.likesService.deleteLikeWithEntityManager(
        entityManager,
        existBoard.id,
        userId,
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
