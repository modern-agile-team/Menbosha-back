import { IsNumber, IsString } from 'class-validator';

export class UpdateHelpMeBoardDto {
  @IsString()
  head: string;

  @IsString()
  body: string;

  @IsNumber()
  categoryId: number;
}
