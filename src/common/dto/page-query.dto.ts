import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsPositiveInt } from '@src/common/decorators/validators/is-positive-int.decorator';
import { IsOptional } from 'class-validator';

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
    minimum: 1,
    default: 5,
  })
  @IsOptional()
  @IsPositiveInt()
  pageSize: number = 5;
}
