import { IsNumber, IsString } from 'class-validator';

export class UpdateMentorBoardDto {
  @IsString()
  head: string;

  @IsString()
  body: string;

  @IsNumber()
  categoryId: number;
}
