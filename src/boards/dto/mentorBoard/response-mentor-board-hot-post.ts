import { OmitType } from '@nestjs/swagger';
import { MentorBoardHotPostDto } from './mentor-board-hot-post.dto';
import { MentorBoardDto } from './mentor-board.dto';

export class ResponseMentorBoardHotPostsDto extends OmitType(
  MentorBoardHotPostDto,
  ['parentId'],
) {
  mentorBoard: MentorBoardDto;
}
