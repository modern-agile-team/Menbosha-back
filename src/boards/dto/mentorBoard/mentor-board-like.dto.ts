import { ApiProperty } from '@nestjs/swagger';
import { MentorBoardLike } from '@src/boards/entities/mentor-board-like.entity';

export class MentorBoardLikeDto
  implements Pick<MentorBoardLike, 'id' | 'userId' | 'parentId' | 'createdAt'>
{
  @ApiProperty({
    description: '멘토 게시판 글 좋아요 고유 ID',
    type: 'integer',
    minimum: 1,
  })
  id: number;

  @ApiProperty({
    description: '멘토 게시판 글 좋아요 누른 유저 고유 ID',
    type: 'integer',
    minimum: 1,
  })
  userId: number;

  @ApiProperty({
    description: '멘토 게시판 글 고유 ID',
    type: 'integer',
    minimum: 1,
  })
  parentId: number;

  @ApiProperty({
    description: '생성 일자',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  constructor(mentorBoardLikeDto: MentorBoardLikeDto) {
    Object.assign(this, mentorBoardLikeDto);
  }
}
