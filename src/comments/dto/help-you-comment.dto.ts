import { ApiProperty } from '@nestjs/swagger';
import { HelpYouComment } from '@src/comments/entities/help-you-comment.entity';
import { Exclude } from 'class-transformer';

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
    format: 'timestamp',
  })
  createdAt: Date;

  @Exclude()
  deletedAt: Date | null;

  constructor(helpYouCommentDto: HelpYouCommentDto) {
    Object.assign(this, helpYouCommentDto);
  }
}
