import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { MentorBoard } from '../entities/mentor-board.entity';
import { MentorBoardForHotPostDto } from '../dto/mentorBoard/mentor-board-for-hot-post.dto';
import { MentorBoardPageQueryDto } from '../dto/mentorBoard/mentor-board-page-query.dto';
import { ResponseMentorBoardHotPostPaginationDto } from '../dto/mentorBoard/response-mentor-board-hot-post-pagination.dto';
import { HotPostsRepository } from 'src/hot-posts/repositories/hot-posts.repository';

@Injectable()
export class MentorBoardHotPostsService {
  constructor(
    private readonly hotPostsRepository: HotPostsRepository<MentorBoard>,
    private readonly entityManager: EntityManager,
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

  async findAllMentorBoardHotPostsWithLimitQuery(
    mentorBoardPageQueryDto: MentorBoardPageQueryDto,
  ): Promise<ResponseMentorBoardHotPostPaginationDto> {
    const { page, orderField, sortOrder, pageSize, categoryId } =
      mentorBoardPageQueryDto;

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
      .where(categoryId === 1 ? '' : 'mentorBoard.categoryId = :categoryId', {
        categoryId,
      })
      .andWhere('mentorBoard.popularAt IS NOT NULL')
      .orderBy(`mentorBoard.${orderField}`, sortOrder)
      .skip(skip)
      .take(pageSize);

    const mentorBoardHotPosts =
      await this.hotPostsRepository.findAllHotPostsByQueryBuilder(query);

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
