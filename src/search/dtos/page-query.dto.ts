import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Min } from 'class-validator';

export class PageQueryDto {
  @ApiPropertyOptional({
    description: '검색할 페이지 number',
    format: 'integer',
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @Min(1)
  page?: number = 1;
}
