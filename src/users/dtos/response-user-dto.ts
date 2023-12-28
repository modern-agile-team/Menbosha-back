import { IsString } from 'class-validator';

export class ResponseUserIntroDto {
  @IsString()
  mainField: string;

  @IsString()
  introduce: string;

  @IsString()
  career: string;
}
