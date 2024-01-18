import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional } from 'class-validator';
import { MentorBoardOrderField } from 'src/boards/constants/mentor-board-order-field.enum';
import { SortOrder } from '../../../common/constants/sort-order.enum';
import { PageQueryDto } from 'src/common/dto/page-query.dto';
import { IsPositiveInt } from 'src/common/dto/validators/is-positive-int.decorator';

export class MentorBoardPageQueryDto extends PageQueryDto {
  @ApiPropertyOptional({
    description: '조회할 category의 id',
    format: 'integer',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsPositiveInt()
  categoryId: number = 1;

  @ApiPropertyOptional({
    description: '정렬의 기준으로 잡을 필드',
    enum: MentorBoardOrderField,
    default: MentorBoardOrderField.id,
  })
  @IsOptional()
  @IsEnum(MentorBoardOrderField)
  orderField: MentorBoardOrderField = MentorBoardOrderField.id;

  @ApiPropertyOptional({
    description: '오름차순 혹은 내림차순',
    enum: SortOrder,
    default: SortOrder.Asc,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.Asc;
}
