import { ApiPropertyOptional } from '@nestjs/swagger';
import { QUERY_PAGE_SIZE } from '@src/common/constants/query-page-size';
import { IsPositiveInt } from '@src/common/decorators/validators/is-positive-int.decorator';
import { IsOptional, Max } from 'class-validator';

export class PageQueryDto {
  @ApiPropertyOptional({
    description: '검색할 페이지 number',
    format: 'integer',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsPositiveInt()
  page: number = 1;

  @ApiPropertyOptional({
    description: '검색할 페이지 size',
    minimum: QUERY_PAGE_SIZE.MIN,
    maximum: QUERY_PAGE_SIZE.MAX,
    default: QUERY_PAGE_SIZE.DEFAULT,
  })
  @IsOptional()
  @IsPositiveInt()
  @Max(QUERY_PAGE_SIZE.MAX)
  pageSize: number = QUERY_PAGE_SIZE.DEFAULT;
}
