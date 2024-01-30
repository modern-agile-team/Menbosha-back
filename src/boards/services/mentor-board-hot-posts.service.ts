import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { MentorBoard } from '../entities/mentor-board.entity';
import { MentorBoardForHotPostDto } from '../dto/mentorBoard/mentor-board-for-hot-post.dto';
import { MentorBoardPageQueryDto } from '../dto/mentorBoard/mentor-board-page-query.dto';
import { ResponseMentorBoardHotPostPaginationDto } from '../dto/mentorBoard/response-mentor-board-hot-post-pagination.dto';
import { HotPostsRepository } from 'src/hot-posts/repositories/hot-posts.repository';
import { CategoryService } from 'src/category/services/category.service';
import { MentorBoardRepository } from '../repository/mentor.boards.repository';

@Injectable()
export class MentorBoardHotPostsService {
  constructor(
    private readonly hotPostsRepository: HotPostsRepository<MentorBoard>,
    private readonly categoryService: CategoryService,
    private readonly mentorBoardRepository: MentorBoardRepository,
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

  /**
   * @todo 멘토 보드 api로 통합되면 메서드 명 및 변수명 수정
   */
  async findAllMentorBoardHotPostsWithLimitQuery(
    mentorBoardPageQueryDto: MentorBoardPageQueryDto,
  ): Promise<ResponseMentorBoardHotPostPaginationDto> {
    const { page, pageSize, orderField, sortOrder, ...filter } =
      mentorBoardPageQueryDto;

    const category = await this.categoryService.findOneCategoryOrNotFound(
      filter.categoryId,
    );

    filter.categoryId = category.id;

    const skip = (page - 1) * pageSize;

    const mentorBoardHotPosts =
      await this.mentorBoardRepository.findAllMentorBoardsByQueryBuilder(
        skip,
        pageSize,
        orderField,
        sortOrder,
        filter,
      );

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
