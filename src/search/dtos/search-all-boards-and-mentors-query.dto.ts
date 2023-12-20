import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Length, Min } from 'class-validator';

export class SearchAllBoardsAndMentorsQueryDto {
  @ApiProperty({
    description: '검색할 페이지 number',
    format: 'integer',
    minimum: 1,
  })
  @Type(() => Number)
  @Min(1)
  page: number;

  @ApiProperty({
    description: '검색어',
    minLength: 2,
  })
  @Length(2)
  searchQuery: string;
}
