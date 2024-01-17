import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';
import { PageQueryDto } from '../../common/dto/page-query.dto';

export class SearchAllBoardsAndMentorsQueryDto extends PageQueryDto {
  @ApiProperty({
    description: '검색어',
    minLength: 2,
  })
  @Length(2)
  searchQuery: string;
}
