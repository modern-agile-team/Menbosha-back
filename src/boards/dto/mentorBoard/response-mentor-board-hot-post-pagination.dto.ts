import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { MentorBoardForHotPostDto } from './mentor-board-for-hot-post.dto';

export class ResponseMentorBoardHotPostPaginationDto extends PaginationResponseDto {
  mentorBoardForHotPostsItemDto: MentorBoardForHotPostDto[];

  constructor(
    mentorBoardForHotPostDto: MentorBoardForHotPostDto[],
    totalCount: number,
    page: number,
    pageSize: number,
  ) {
    super(totalCount, page, pageSize);

    this.mentorBoardForHotPostsItemDto = mentorBoardForHotPostDto;
  }
}
