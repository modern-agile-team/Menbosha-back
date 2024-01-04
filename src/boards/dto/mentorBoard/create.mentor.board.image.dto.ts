import { IsNumber, IsString } from 'class-validator';

export class CreateMentorBoardImageDto {
  @IsNumber()
  id: number;

  @IsNumber()
  helpMeBoardId: number;

  @IsString()
  imageUrl: string;
}
