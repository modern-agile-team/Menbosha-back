import { ApiProperty } from '@nestjs/swagger';

import { IsBooleanString, IsEnum, IsOptional } from 'class-validator';
import { MentorBoardOrderField } from 'src/boards/constants/mentor-board-order-field.enum';
import { SortOrder } from '../../../common/constants/sort-order.enum';
import { PageQueryDto } from 'src/common/dto/page-query.dto';
import { IsPositiveInt } from 'src/common/decorators/validators/is-positive-int.decorator';
import { Type } from 'class-transformer';

export class MentorBoardPageQueryDto extends PageQueryDto {
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
    description: '인기 게시글만 불러올 지, 인기 멘토 게시판을 불러올 지 여부',
    default: false,
  })
  @IsOptional()
  @IsBooleanString()
  @Type(() => Boolean)
  loadOnlyPopular: boolean = false;

  @ApiProperty({
    description: '정렬의 기준으로 잡을 필드',
    enum: MentorBoardOrderField,
    default: MentorBoardOrderField.id,
  })
  @IsOptional()
  @IsEnum(MentorBoardOrderField)
  orderField: MentorBoardOrderField = MentorBoardOrderField.id;

  @ApiProperty({
    description: '오름차순 혹은 내림차순',
    enum: SortOrder,
    default: SortOrder.Asc,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.Asc;
}
