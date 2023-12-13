import { IsNumber, IsString } from 'class-validator';

export class CreateHelpMeBoardDto {
  @IsString()
  head: string;

  @IsString()
  body: string;

  @IsNumber()
  categoryId: number;
}
