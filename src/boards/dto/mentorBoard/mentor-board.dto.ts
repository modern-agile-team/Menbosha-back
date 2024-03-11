import { ApiProperty } from '@nestjs/swagger';
import { MENTOR_BOARD_HEAD_LENGTH } from '@src/boards/constants/mentor-board/mentor-board.constant';
import { MentorBoard } from '@src/entities/MentorBoard';
import { Exclude } from 'class-transformer';

export class MentorBoardDto
  implements
    Omit<
      MentorBoard,
      'user' | 'category' | 'mentorBoardImages' | 'mentorBoardLikes'
    >
{
  @ApiProperty({ description: '멘토 게시판 글 고유 id', format: 'integer' })
  id: number;

  @ApiProperty({
    description: '멘토 게시판 글 작성자 고유 id',
    format: 'integer',
    minimum: 1,
  })
  userId: number;

  @ApiProperty({
    description: '멘토 게시판 글 제목',
    minLength: MENTOR_BOARD_HEAD_LENGTH.MIN,
    maxLength: MENTOR_BOARD_HEAD_LENGTH.MAX,
  })
  head: string;

  @ApiProperty({ description: '멘토 게시판 글 내용' })
  body: string;

  @ApiProperty({ description: '멘토 게시판 글 생성 일자' })
  createdAt: Date;

  @ApiProperty({ description: '멘토 게시판 글 업데이트 일자' })
  updatedAt: Date;

  @Exclude()
  popularAt: Date | null;

  @Exclude()
  deletedAt: Date | null;

  @ApiProperty({ description: '멘토 게시판 글 카테고리 고유 id' })
  categoryId: number;

  constructor(mentorBoardDto: MentorBoardDto) {
    Object.assign(this, mentorBoardDto);
  }
}
