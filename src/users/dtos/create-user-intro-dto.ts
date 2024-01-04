import { IsString } from 'class-validator';

export class CreateUserIntroDto {
  @IsString()
  mainField: string;

  @IsString()
  introduce: string;

  @IsString()
  career: string;
}
