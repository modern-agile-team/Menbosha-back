import { Injectable } from '@nestjs/common';
import { HotPostsRepository } from 'src/hot-posts/repositories/hot-posts.repository';
import { MentorBoardHotPost } from '../entities/mentor-board-hot-post.entity';
import { EntityManager } from 'typeorm';
import { MentorBoard } from '../entities/mentor-board.entity';
import { MentorBoardForHotPostDto } from '../dto/mentorBoard/mentor-board-for-hot-post.dto';
import { MentorBoardPageQueryDto } from '../dto/mentorBoard/mentor-board-page-query.dto';
import { ResponseMentorBoardHotPostPaginationDto } from '../dto/mentorBoard/response-mentor-board-hot-post-pagination.dto';

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

  async findAllMentorBoardHotPostsWithLimitQuery(
    mentorBoardPageQueryDto: MentorBoardPageQueryDto,
    categoryId: number,
  ): Promise<ResponseMentorBoardHotPostPaginationDto> {
    const { page, orderField, sortOrder, pageSize } = mentorBoardPageQueryDto;

    let endIndex = pageSize;

    for (let i = 0; i < page - 1; i++) {
      endIndex += pageSize;
    }

    const skip = (page - 1) * pageSize;

    const boards = await this.entityManager
      .getRepository(MentorBoard)
      .createQueryBuilder('mentorBoard')
      .leftJoin(
        'mentorBoard.mentorBoardImages',
        'mentorBoardImages',
        'mentorBoardImages.id = (SELECT id FROM mentor_board_image WHERE mentor_board_id = mentorBoard.id ORDER BY id DESC LIMIT 1)',
      )
      .leftJoin('mentorBoard.mentorBoardLikes', 'mentorBoardLikes')
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
      .where('mentorBoard.categoryId = :categoryId', { categoryId })
      .orderBy(`mentorBoard.${orderField}`, sortOrder)
      .getMany();

    const filteredBoard = boards.filter((board) => {
      return board.mentorBoardLikes.length > 9;
    });

    const slicedBoards = filteredBoard.slice(skip, endIndex);

    const mentorBoardForHotPostDto = slicedBoards.map((slicedBoard) => {
      return new MentorBoardForHotPostDto(slicedBoard);
    });

    return new ResponseMentorBoardHotPostPaginationDto(
      mentorBoardForHotPostDto,
      filteredBoard.length,
      page,
      pageSize,
    );
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
