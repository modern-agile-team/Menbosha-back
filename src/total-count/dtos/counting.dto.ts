import { IsIn } from 'class-validator';
import { Action } from '../enums/action.enum';
import { Type } from '../enums/type.enum';

export class CountingDto {
  mentorId?: number;

  @IsIn(Object.values(Type), {
    message:
      'type은 countMentorBoard, countHelpYouComment, countMentorBoardLike, countBadge, countReview 중 하나만 가능합니다.',
  })
  type: Type;

  @IsIn(Object.values(Action), {
    message: 'action은 increment 또는 decrement만 가능합니다.',
  })
  action: Action;
}
