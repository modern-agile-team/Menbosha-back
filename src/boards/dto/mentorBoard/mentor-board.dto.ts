import { ApiProperty } from '@nestjs/swagger';
import { MentorBoardImage } from 'src/boards/entities/mentor-board-image.entity';
import { MentorBoardLike } from 'src/boards/entities/mentor-board-like.entity';
import { MentorBoard } from 'src/boards/entities/mentor-board.entity';

export class MentorBoardDto
  implements Omit<MentorBoard, 'user' | 'categoryList' | 'mentorBoardHotPost'>
{
  @ApiProperty({ description: '멘토 게시판 글 고유 id', format: 'integer' })
  id: number;

  @ApiProperty({
    description: '멘토 게시판 글 작성자 고유 id',
    format: 'integer',
    minimum: 1,
  })
  userId: number;

  @ApiProperty({ description: '멘토 게시판 글 제목' })
  head: string;

  @ApiProperty({ description: '멘토 게시판 글 내용' })
  body: string;

  @ApiProperty({ description: '멘토 게시판 이미지' })
  mentorBoardImages: MentorBoardImage[];

  @ApiProperty({
    description: '멘토 게시판 글 좋아요',
  })
  mentorBoardLikes: MentorBoardLike[];

  @ApiProperty({ description: '멘토 게시판 글 생성 일자' })
  createdAt: Date;

  @ApiProperty({ description: '멘토 게시판 글 업데이트 일자' })
  updatedAt: Date;

  @ApiProperty({ description: '멘토 게시판 글 카테고리 고유 id' })
  categoryId: number;

  constructor(mentorBoardDto: MentorBoardDto) {
    Object.assign(this, mentorBoardDto);
  }
}
