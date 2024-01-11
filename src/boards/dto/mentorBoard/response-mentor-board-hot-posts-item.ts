import { ApiProperty, OmitType } from '@nestjs/swagger';
import { MentorBoardHotPostDto } from './mentor-board-hot-post.dto';
import { MentorBoardForHotPostDto } from './mentor-board-for-hot-post.dto';

export class ResponseMentorBoardHotPostsItemDto extends OmitType(
  MentorBoardHotPostDto,
  ['parentId'],
) {
  @ApiProperty({
    description: '멘토 게시판 인기글 객체',
  })
  mentorBoard: MentorBoardForHotPostDto;

  constructor(
    responseMentorBoardHotPostDto: ResponseMentorBoardHotPostsItemDto,
  ) {
    super();

    Object.assign(this, responseMentorBoardHotPostDto);
  }
}