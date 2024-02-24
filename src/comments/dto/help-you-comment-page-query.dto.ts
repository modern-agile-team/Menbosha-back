import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { SortOrder } from '@src/common/constants/sort-order.enum';
import { IsPositiveInt } from '@src/common/decorators/validators/is-positive-int.decorator';
import { PageQueryDto } from '@src/common/dto/page-query.dto';
import { HelpYouCommentOrderField } from '../constants/help-you-comment-order-field.enum';

export class HelpYouCommentPageQueryDto extends PageQueryDto {
  @ApiPropertyOptional({
    description: '도와줄게요 댓글 고유 ID 필터링',
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

  @ApiProperty({
    description: '정렬의 기준으로 잡을 필드',
    enum: HelpYouCommentOrderField,
    default: HelpYouCommentOrderField.id,
  })
  @IsOptional()
  @IsEnum(HelpYouCommentOrderField)
  orderField: HelpYouCommentOrderField = HelpYouCommentOrderField.id;

  @ApiProperty({
    description: '오름차순 혹은 내림차순',
    enum: SortOrder,
    default: SortOrder.Asc,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.Asc;
}
