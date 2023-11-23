import { IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  content: string;
}
