import { IsEnum } from 'class-validator';
import { Action } from '../enums/action.enum';
import { Type } from '../enums/type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCountingDto {
  mentorId?: number;

  @ApiProperty({
    description:
      'countMentorBoard: 멘토 게시글 조회수, countHelpYouComment: 도와주세요 댓글 조회수, countMentorBoardLike: 멘토 게시글 좋아요 수, countBadge: 멘토 뱃지 수, countReview: 멘토 후기 수',
    enum: Type,
    default: Type.CountMentorBoard,
  })
  @IsEnum(Type, {
    message:
      'type은 countMentorBoard, countHelpYouComment, countMentorBoardLike, countBadge, countReview 중 하나만 가능합니다.',
  })
  type: Type;

  @ApiProperty({
    description: 'increment: 증가, decrement: 감소',
    enum: Action,
    default: Action.Increment,
  })
  @IsEnum(Action, {
    message: 'action은 increment 또는 decrement만 가능합니다.',
  })
  action: Action;
}
