import { HELP_ME_BOARD_HEAD_LENGTH } from '@src/boards/constants/help-me-board/help-me-board.constant';
import { IsNumber, IsString, Length } from 'class-validator';

export class CreateHelpMeBoardDto {
  @Length(HELP_ME_BOARD_HEAD_LENGTH.MIN, HELP_ME_BOARD_HEAD_LENGTH.MAX)
  head: string;

  @IsString()
  body: string;

  @IsNumber()
  categoryId: number;
}
