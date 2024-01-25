import { IsOptional, IsString } from 'class-validator';

export class CreateUserIntroDto {
  @IsString()
  shortIntro: string;

  @IsString()
  career: string;

  @IsString()
  customCategory: string;

  @IsOptional()
  @IsString()
  detail?: string;

  @IsOptional()
  @IsString()
  portfolio?: string;

  @IsOptional()
  @IsString()
  sns?: string;
}
