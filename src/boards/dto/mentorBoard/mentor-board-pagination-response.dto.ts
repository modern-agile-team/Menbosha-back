import { PaginationResponseDto } from '@src/common/dto/pagination-response.dto';
import { MentorBoardWithUserAndImageDto } from './mentor-board-with-user-and-image.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @todo 멘토 보드로 통합되면 dto명 수정 및 Property description 수정
 */
export class MentorBoardPaginationResponseDto extends PaginationResponseDto {
  @ApiProperty({
    type: [MentorBoardWithUserAndImageDto],
    description: '멘토 게시판 인기 글 item',
  })
  mentorBoardWithUserAndImageDtos: MentorBoardWithUserAndImageDto[];

  constructor(
    mentorBoardForHotPostDto: MentorBoardWithUserAndImageDto[],
    totalCount: number,
    page: number,
    pageSize: number,
  ) {
    super(totalCount, page, pageSize);

    this.mentorBoardWithUserAndImageDtos = mentorBoardForHotPostDto;
  }
}
