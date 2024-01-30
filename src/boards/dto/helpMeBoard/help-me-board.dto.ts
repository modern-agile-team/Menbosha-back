import { ApiProperty } from '@nestjs/swagger';
import { HelpMeBoard } from 'src/boards/entities/help-me-board.entity';

export class HelpMeBoardDto
  implements Omit<HelpMeBoard, 'user' | 'categoryList' | 'helpMeBoardImages'>
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

  @ApiProperty({ description: '멘토 게시판 글 생성 일자' })
  createdAt: Date;

  @ApiProperty({ description: '멘토 게시판 글 업데이트 일자' })
  updatedAt: Date;

  pullingUp: Date | null;

  @ApiProperty({ description: '멘토 게시판 글 카테고리 고유 id' })
  categoryId: number;

  constructor(helpMeBoardDto: HelpMeBoardDto) {
    Object.assign(this, helpMeBoardDto);
  }
}
