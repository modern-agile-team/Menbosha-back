import { ApiProperty } from '@nestjs/swagger';
import { PageQueryDto } from '@src/common/dto/page-query.dto';
import { Length } from 'class-validator';

export class SearchAllBoardsAndMentorsQueryDto extends PageQueryDto {
  @ApiProperty({
    description: '검색어',
    minLength: 2,
  })
  @Length(2)
  searchQuery: string;
}
