import { IsNumber, IsString } from 'class-validator';

export class CreateHelpMeBoardImageDto {
  @IsNumber()
  id: number;

  @IsNumber()
  helpMeBoardId: number;

  @IsString()
  imageUrl: string;
}
