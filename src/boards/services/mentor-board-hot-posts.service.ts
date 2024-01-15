import { Injectable } from '@nestjs/common';
import { HotPostsRepository } from 'src/hot-posts/repositories/hot-posts.repository';
import { MentorBoardHotPost } from '../entities/mentor-board-hot-post.entity';
import { EntityManager } from 'typeorm';
import { MentorBoard } from '../entities/mentor-board.entity';
import { MentorBoardLike } from '../entities/mentor-board-like.entity';
import { MentorBoardForHotPostDto } from '../dto/mentorBoard/mentor-board-for-hot-post.dto';
import { plainToInstance } from 'class-transformer';
import { MentorBoardImage } from '../entities/mentor-board-image.entity';

@Injectable()
export class MentorBoardHotPostsService {
  constructor(
    private readonly hotPostsRepository: HotPostsRepository<MentorBoardHotPost>,
    private readonly entityManager: EntityManager,
  ) {}

  createMentorBoardHotPostOrIncrease(
    entityManager: EntityManager,
    mentorBoardId: number,
    likeCount: number,
  ): Promise<void> {
    if (likeCount === 10) {
      return this.hotPostsRepository.createHotPost(
        entityManager,
        mentorBoardId,
        likeCount,
      );
    } else if (likeCount > 10) {
      return this.hotPostsRepository.increaseLikeCount(
        entityManager,
        mentorBoardId,
      );
    }

    return;
  }

  async findAllMentorBoardHotPostsWithLimitQuery() {
    const boards = await this.entityManager
      .getRepository(MentorBoard)
      .createQueryBuilder('mentorBoard')
      .leftJoinAndSelect(
        (qb) =>
          qb
            .from(MentorBoardImage, 'mentorBoardImages')
            .where('mentorBoardImages.mentorBoardId = mentorBoard.id')
            .orderBy('mentorBoardImages.createdAt', 'DESC')
            .limit(1),
        'mentorBoardImages',
      )
      .leftJoin('mentorBoard.mentorBoardImages', 'mentorBoardImages')
      .innerJoin('mentorBoard.user', 'user')
      .innerJoin('user.userImage', 'userImage')
      .select([
        'mentorBoard.id',
        'mentorBoard.userId',
        'mentorBoard.head',
        'mentorBoard.body',
        'mentorBoard.categoryId',
        'mentorBoard.createdAt',
        'mentorBoard.updatedAt',
        'user.name',
        'userImage.imageUrl',
        'mentorBoardLikes.id',
        'mentorBoardLikes.userId',
        'mentorBoardImages.id',
        'mentorBoardImages.imageUrl',
      ])
      .orderBy('mentorBoard.createdAt', 'DESC')
      .getMany();

    const filteredBoard = boards.filter((board) => {
      return board.mentorBoardLikes.length > 9;
    });

    /**
     * @todo limit값 프론트에서 받도록 변경
     */
    if (filteredBoard.length > 5) {
      const slicedBoards = filteredBoard.slice(0, 4);

      const mentorBoardForHotPostDto = slicedBoards.map((slicedBoard) => {
        return new MentorBoardForHotPostDto(slicedBoard);
      });

      return mentorBoardForHotPostDto;
    }
    const mentorBoardForHotPostDto = filteredBoard.map((filterBoard) => {
      return new MentorBoardForHotPostDto(filterBoard);
    });

    return mentorBoardForHotPostDto;
  }

  findAllMentorBoardHotPostsWithLimit() {
    return this.hotPostsRepository.findAllHotPosts({
      select: {
        id: true,
        likeCount: true,
        mentorBoard: {
          id: true,
          userId: true,
          head: true,
          body: true,
          categoryId: true,
          createdAt: true,
          updatedAt: true,
          user: {
            name: true,
            userImage: {
              imageUrl: true,
            },
          },
          mentorBoardImages: {
            id: true,
            imageUrl: true,
          },
          mentorBoardLikes: true,
        },
        createdAt: true,
      },
      relations: {
        mentorBoard: {
          user: {
            userImage: true,
          },
          mentorBoardImages: true,
          mentorBoardLikes: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      take: 5,
    });
  }

  deleteMentorBoardHotPostOrDecrease(
    entityManager: EntityManager,
    mentorBoardId: number,
    likeCount: number,
  ): Promise<void> {
    if (likeCount < 10) {
      return this.hotPostsRepository.deleteHotPost(
        entityManager,
        mentorBoardId,
      );
    } else if (likeCount > 9) {
      return this.hotPostsRepository.decreaseLikeCount(
        entityManager,
        mentorBoardId,
      );
    }

    return;
  }
}
