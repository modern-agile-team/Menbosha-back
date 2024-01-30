import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { MentorBoard } from '../entities/mentor-board.entity';
import { MentorBoardForHotPostDto } from '../dto/mentorBoard/mentor-board-for-hot-post.dto';
import { MentorBoardPageQueryDto } from '../dto/mentorBoard/mentor-board-page-query.dto';
import { ResponseMentorBoardHotPostPaginationDto } from '../dto/mentorBoard/response-mentor-board-hot-post-pagination.dto';
import { HotPostsRepository } from 'src/hot-posts/repositories/hot-posts.repository';
import { CategoryService } from 'src/category/services/category.service';
import { MentorBoardDto } from '../dto/mentorBoard/mentor-board.dto';
import { QueryBuilderHelper } from 'src/helpers/query-builder.helper';

@Injectable()
export class MentorBoardHotPostsService {
  private readonly FULL_TEXT_SEARCH_FIELD: readonly (keyof Pick<
    MentorBoardDto,
    'head' | 'body'
  >)[] = ['head', 'body'];

  constructor(
    private readonly hotPostsRepository: HotPostsRepository<MentorBoard>,
    private readonly entityManager: EntityManager,
    private readonly categoryService: CategoryService,
    private readonly queryBuilderHelper: QueryBuilderHelper,
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
    const { page, pageSize, orderField, sortOrder, ...filter } =
      mentorBoardPageQueryDto;

    const category = await this.categoryService.findOneCategoryOrNotFound(
      filter.categoryId,
    );

    const skip = (page - 1) * pageSize;

    const queryBuilder = this.entityManager
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
        'mentorBoard.popularAt',
        'user.name',
        'userImage.imageUrl',
        'mentorBoardLikes.id',
        'mentorBoardLikes.userId',
        'mentorBoardImages.id',
        'mentorBoardImages.imageUrl',
      ]);

    this.queryBuilderHelper.buildWherePropForBoardFind(
      queryBuilder,
      {
        ...filter,
        categoryId: category.id,
      },
      'mentorBoard',
      this.FULL_TEXT_SEARCH_FIELD,
    );

    queryBuilder
      .orderBy(`mentorBoard.${orderField}`, sortOrder)
      .skip(skip)
      .take(pageSize);

    const mentorBoardHotPosts =
      await this.hotPostsRepository.findAllHotPostsByQueryBuilder(queryBuilder);

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
