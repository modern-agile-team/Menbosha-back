import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { MentorBoardHotPost } from 'src/boards/entities/mentor-board-hot-post.entity';

export class MentorBoardHotPostDto
  implements
    Pick<
      MentorBoardHotPost,
      'id' | 'parentId' | 'createdAt' | 'deletedAt' | 'likeCount'
    >
{
  @ApiProperty({
    description: '멘토 게시판 인기 글 모음 고유 ID',
  })
  id: number;

  @ApiProperty({
    description: '멘토 게시판 인기 글의 원글 고유 ID',
  })
  parentId: number;

  @ApiProperty({
    description: '좋아요 개수(최소 5)',
    minimum: 5,
  })
  likeCount: number;

  @ApiProperty({
    description: '생성 일자',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @Exclude()
  deletedAt: Date | null;
}
