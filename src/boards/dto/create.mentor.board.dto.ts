import { IsNumber, IsString } from 'class-validator';

export class CreateMentorBoardDto {
  @IsString()
  head: string;

  @IsString()
  body: string;

  @IsNumber()
  categoryId: number;
}
