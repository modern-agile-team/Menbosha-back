import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PageQueryDto } from '@src/common/dto/page-query.dto';
import { SortOrder } from '@src/common/constants/sort-order.enum';
import { IsPositiveInt } from '@src/common/decorators/validators/is-positive-int.decorator';
import { MentorReviewOrderField } from '@src/mentors/mentor-reviews/constants/mentor-review-order-field.enum';

export class MentorReviewPageQueryDto extends PageQueryDto {
  @ApiPropertyOptional({
    description: '리뷰 고유 ID 필터링',
    format: 'integer',
  })
  @IsOptional()
  @IsPositiveInt()
  id?: number;

  @ApiPropertyOptional({
    description: '멘티 고유 ID 필터링',
    format: 'integer',
  })
  @IsOptional()
  @IsPositiveInt()
  menteeId?: number;

  @ApiPropertyOptional({
    description: '리뷰 내용 필터링',
  })
  @IsOptional()
  @IsString()
  review?: string;

  @ApiPropertyOptional({
    description: '정렬의 기준으로 잡을 필드',
    enum: MentorReviewOrderField,
    default: MentorReviewOrderField.id,
  })
  @IsOptional()
  @IsEnum(MentorReviewOrderField)
  orderField: MentorReviewOrderField = MentorReviewOrderField.id;

  @ApiPropertyOptional({
    description: '오름차순 혹은 내림차순',
    enum: SortOrder,
    default: SortOrder.ASC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.ASC;
}
