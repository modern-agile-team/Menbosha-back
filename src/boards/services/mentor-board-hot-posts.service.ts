import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import { HotPostsRepository } from 'src/hot-posts/repositories/hot-posts.repository';
// import { MentorBoardHotPost } from '../entities/mentor-board-hot-post.entity';
import { EntityManager } from 'typeorm';
import { MentorBoard } from '../entities/mentor-board.entity';
import { MentorBoardForHotPostDto } from '../dto/mentorBoard/mentor-board-for-hot-post.dto';
import { MentorBoardPageQueryDto } from '../dto/mentorBoard/mentor-board-page-query.dto';
import { ResponseMentorBoardHotPostPaginationDto } from '../dto/mentorBoard/response-mentor-board-hot-post-pagination.dto';
import { MentorBoardRepository } from '../repository/mentor.boards.repository';
import { HotPostsRepositoryNew } from 'src/hot-posts/repositories/hot-posts-new.repository';

/**
 * @todo 추후에 어떤 방식 선택할지 결정하고 둘 중 하나 삭제
 */
@Injectable()
export class MentorBoardHotPostsService {
  constructor(
    private readonly hotPostsRepositoryNew: HotPostsRepositoryNew<MentorBoard>,
    private readonly mentorBoardRepository: MentorBoardRepository,
    private readonly entityManager: EntityManager,
  ) {}

  async createMentorBoardHotPostOrIncrease(
    entityManager: EntityManager,
    mentorBoardId: number,
    likeCount: number,
  ): Promise<void> {
    if (likeCount === 10) {
      const updateResult = await this.hotPostsRepositoryNew.createHotPost(
        entityManager,
        mentorBoardId,
      );

      if (!updateResult.affected) {
        throw new InternalServerErrorException(
          '멘토 게시글 업데이트 중 서버 에러 발생',
        );
      }
      // return this.hotPostsRepository.createHotPost(
      //   entityManager,
      //   mentorBoardId,
      //   likeCount,
      // );
    }
    //  else if (likeCount > 10) {
    //   return this.hotPostsRepository.increaseLikeCount(
    //     entityManager,
    //     mentorBoardId,
    //   );
    // }
  }

  async findAllMentorBoardHotPostsWithLimitQuery(
    mentorBoardPageQueryDto: MentorBoardPageQueryDto,
    categoryId: number,
  ): Promise<ResponseMentorBoardHotPostPaginationDto> {
    const { page, orderField, sortOrder, pageSize } = mentorBoardPageQueryDto;

    const skip = (page - 1) * pageSize;

    const query = this.entityManager
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
      .andWhere('mentorBoard.popularAt IS NOT NULL')
      .orderBy(`mentorBoard.${orderField}`, sortOrder)
      .skip(skip)
      .take(pageSize);

    const mentorBoardHotPosts =
      await this.hotPostsRepositoryNew.findAllHotPostsByQueryBuilder(query);

    const mentorBoardForHotPostDto = mentorBoardHotPosts.map(
      (mentorBoardHotPost) => {
        return new MentorBoardForHotPostDto(mentorBoardHotPost);
      },
    );

    return new ResponseMentorBoardHotPostPaginationDto(
      mentorBoardForHotPostDto,
      mentorBoardHotPosts.length,
      page,
      pageSize,
    );
  }

  // findAllMentorBoardHotPostsWithLimit() {
  //   return this.hotPostsRepository.findAllHotPosts({
  //     select: {
  //       id: true,
  //       likeCount: true,
  //       mentorBoard: {
  //         id: true,
  //         userId: true,
  //         head: true,
  //         body: true,
  //         categoryId: true,
  //         createdAt: true,
  //         updatedAt: true,
  //         user: {
  //           name: true,
  //           userImage: {
  //             imageUrl: true,
  //           },
  //         },
  //         mentorBoardImages: {
  //           id: true,
  //           imageUrl: true,
  //         },
  //       },
  //       createdAt: true,
  //     },
  //     relations: {
  //       mentorBoard: {
  //         user: {
  //           userImage: true,
  //         },
  //         mentorBoardImages: true,
  //       },
  //     },
  //     order: {
  //       createdAt: 'DESC',
  //     },
  //     take: 5,
  //   });
  // }

  async deleteMentorBoardHotPostOrDecrease(
    entityManager: EntityManager,
    mentorBoardId: number,
    likeCount: number,
  ): Promise<void> {
    if (likeCount < 10) {
      const updateResult = await this.hotPostsRepositoryNew.deleteHotPost(
        entityManager,
        mentorBoardId,
      );

      if (!updateResult.affected) {
        throw new InternalServerErrorException(
          '멘토 게시글 업데이트 중 서버 에러 발생',
        );
      }
      // return this.hotPostsRepository.deleteHotPost(
      //   entityManager,
      //   mentorBoardId,
      // );
    }
    // } else if (likeCount > 9) {
    //   return this.hotPostsRepository.decreaseLikeCount(
    //     entityManager,
    //     mentorBoardId,
    //   );
    // }
  }
}
