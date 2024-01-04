import { IsString } from 'class-validator';

export class UpdateUserIntroDTO {
  @IsString()
  mainField: string;

  @IsString()
  introduce: string;

  @IsString()
  career: string;
}
