import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { IsPositiveInt } from '../decorators/validators/is-positive-int.decorator';

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
    minimum: 5,
    default: 5,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(5)
  pageSize: number = 5;
}
