import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional } from 'class-validator';
import { MentorBoardOrderField } from 'src/boards/constants/mentor-board-order-field.enum';
import { SortOrder } from '../../../common/constants/sort-order.enum';
import { PageQueryDto } from 'src/common/dto/page-query.dto';

export class MentorBoardPageQueryDto extends PageQueryDto {
  @ApiPropertyOptional({
    description: '정렬의 기준으로 잡을 필드',
    enum: MentorBoardOrderField,
    default: MentorBoardOrderField.id,
  })
  @IsOptional()
  @IsEnum(MentorBoardOrderField)
  orderField?: MentorBoardOrderField = MentorBoardOrderField.id;

  @ApiPropertyOptional({
    description: '오름차순 혹은 내림차순',
    enum: SortOrder,
    default: SortOrder.Asc,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.Asc;
}
