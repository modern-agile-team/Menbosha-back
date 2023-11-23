import { IsString } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  head: string;

  @IsString()
  body: string;
}
