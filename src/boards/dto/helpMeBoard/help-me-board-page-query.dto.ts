import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { SortOrder } from '../../../common/constants/sort-order.enum';
import { PageQueryDto } from 'src/common/dto/page-query.dto';
import { IsPositiveInt } from 'src/common/decorators/validators/is-positive-int.decorator';
import { HelpMeBoardOrderField } from 'src/boards/constants/help-me-board-order-field.enum';
import { ParseOptionalBoolean } from 'src/common/transformers/parse-optional-boolean.transformer';

export class HelpMeBoardPageQueryDto extends PageQueryDto {
  @ApiPropertyOptional({
    description: '도와주세요 게시글 고유 ID 필터링',
    format: 'integer',
  })
  @IsOptional()
  @IsPositiveInt()
  id?: number;

  @ApiPropertyOptional({
    description: '유저 고유 ID 필터링',
    format: 'integer',
  })
  @IsOptional()
  @IsPositiveInt()
  userId?: number;

  @ApiPropertyOptional({
    description: '제목 필터링',
  })
  @IsOptional()
  @IsString()
  head?: string;

  @ApiPropertyOptional({
    description: '본문 필터링',
  })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiProperty({
    description: '조회할 category의 id',
    format: 'integer',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsPositiveInt()
  categoryId: number = 1;

  @ApiProperty({
    description:
      '끌올된 도와주세요 게시글만 불러올지 모든 글을 불러올지 결정 여부',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @ParseOptionalBoolean()
  loadOnlyPullingUp: boolean = false;

  @ApiProperty({
    description: '정렬의 기준으로 잡을 필드',
    enum: HelpMeBoardOrderField,
    default: HelpMeBoardOrderField.id,
  })
  @IsOptional()
  @IsEnum(HelpMeBoardOrderField)
  orderField: HelpMeBoardOrderField = HelpMeBoardOrderField.id;

  @ApiProperty({
    description: '오름차순 혹은 내림차순',
    enum: SortOrder,
    default: SortOrder.Asc,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.Asc;
}