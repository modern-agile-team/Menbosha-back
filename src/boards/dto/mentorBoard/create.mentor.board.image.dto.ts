import { IsNumber, IsString } from 'class-validator';

export class CreateMentorBoardImageDto {
  @IsNumber()
  id: number;

  @IsNumber()
  mentorBoardId: number;

  @IsString()
  imageUrl: string;
}
