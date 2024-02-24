import { HelpMeBoardOrderField } from '@src/boards/constants/help-me-board-order-field.enum';
import { MentorBoardOrderField } from '@src/boards/constants/mentor-board-order-field.enum';
import { HelpYouCommentOrderField } from '@src/comments/constants/help-you-comment-order-field.enum';
import { MentorOrderField } from '@src/mentors/constants/mentor-order-field.enum';

export type OrderFieldForHelper =
  | MentorBoardOrderField
  | HelpMeBoardOrderField
  | HelpYouCommentOrderField
  | MentorOrderField;
