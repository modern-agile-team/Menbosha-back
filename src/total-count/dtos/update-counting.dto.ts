import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@src/total-count/enums/type.enum';
import { Action } from '@src/total-count/enums/action.enum';

export class UpdateCountingDto {
  mentorId?: number;

  @ApiProperty({
    description:
      'mentorBoardCount: 멘토 게시글 수, helpYouCommentCount: 도와주세요 댓글 수, mentorBoardLikeCount: 멘토 게시글 좋아요 수, badgeCount: 멘토 뱃지 수, reviewCount: 멘토 후기 수',
    enum: Type,
  })
  @IsEnum(Type, {
    message:
      'type은 mentorBoardCount, helpYouCommentCount, mentorBoardLikeCount, badgeCount, reviewCount 중 하나만 가능합니다.',
  })
  type: Type;

  @ApiProperty({
    description: 'increment: 증가, decrement: 감소',
    enum: Action,
  })
  @IsEnum(Action, {
    message: 'action은 increment 또는 decrement만 가능합니다.',
  })
  action: Action;
}
