import { IsNumber, IsString } from 'class-validator';

export class CreateBoardImageDto {
  @IsNumber()
  id: number;

  @IsNumber()
  helpMeBoardId: number;

  @IsString()
  imageUrl: string;
}
