import { MENTOR_BOARD_HEAD_LENGTH } from '@src/boards/constants/mentor-board/mentor-board.constant';
import { IsNumber, IsString, Length } from 'class-validator';

export class CreateMentorBoardDto {
  @Length(MENTOR_BOARD_HEAD_LENGTH.MIN, MENTOR_BOARD_HEAD_LENGTH.MAX)
  head: string;

  @IsString()
  body: string;

  @IsNumber()
  categoryId: number;
}
