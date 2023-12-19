import { IsNumber, IsString } from 'class-validator';

export class CreateMentorBoardResponseDto {
  @IsString()
  head: string;

  @IsString()
  body: string;

  @IsNumber()
  categoryId: number;
}
