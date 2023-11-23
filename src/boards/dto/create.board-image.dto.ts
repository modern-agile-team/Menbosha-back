import { IsNumber, IsString } from 'class-validator';

export class CreateBoardImageDto {
  @IsNumber()
  id: number;

  @IsNumber()
  boardId: number;

  @IsString()
  imageUrl: string;
}
