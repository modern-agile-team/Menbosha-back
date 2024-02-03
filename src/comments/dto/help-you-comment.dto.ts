import { ApiProperty } from '@nestjs/swagger';
import { HelpYouComment } from '../entities/help-you-comment.entity';

export class HelpYouCommentDto
  implements Omit<HelpYouComment, 'user' | 'helpMeBoard' | 'content'>
{
  @ApiProperty({
    description: '도와줄게요 댓글 고유 ID',
    format: 'integer',
    minimum: 1,
  })
  id: number;

  @ApiProperty({
    description: '도와줄게요 댓글 작성자 고유 ID',
    format: 'integer',
    minimum: 1,
  })
  userId: number;

  @ApiProperty({
    description: '도와주세요 게시글 고유 ID',
    format: 'integer',
    minimum: 1,
  })
  helpMeBoardId: number;

  @ApiProperty({
    description: '생성일자',
  })
  createdAt: Date;
}
