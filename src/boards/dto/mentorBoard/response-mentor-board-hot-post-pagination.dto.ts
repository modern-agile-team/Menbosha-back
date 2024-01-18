import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { MentorBoardForHotPostDto } from './mentor-board-for-hot-post.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseMentorBoardHotPostPaginationDto extends PaginationResponseDto {
  @ApiProperty({
    type: [MentorBoardForHotPostDto],
    description: '멘토 게시판 인기 글 item',
  })
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
