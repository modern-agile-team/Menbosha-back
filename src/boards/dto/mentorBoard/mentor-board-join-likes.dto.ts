import { MentorBoard } from 'src/boards/entities/mentor-board.entity';
import { MentorBoardDto } from './mentor-board.dto';
import { ApiProperty } from '@nestjs/swagger';
import { MentorBoardLike } from 'src/boards/entities/mentor-board-like.entity';

export class MentorBoardJoinLikesDto
  extends MentorBoardDto
  implements Pick<MentorBoard, 'mentorBoardLikes'>
{
  @ApiProperty({
    description: '멘토 게시판 글 좋아요',
  })
  mentorBoardLikes: MentorBoardLike[];

  constructor(mentorBoardJoinLikesDto: MentorBoardJoinLikesDto) {
    super(mentorBoardJoinLikesDto);

    this.mentorBoardLikes = mentorBoardJoinLikesDto.mentorBoardLikes;
  }
}
