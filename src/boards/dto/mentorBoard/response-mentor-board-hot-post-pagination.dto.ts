import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { MentorBoardForHotPostDto } from './mentor-board-for-hot-post.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @todo 멘토 보드로 통합되면 dto명 수정 및 Property description 수정
 */
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
