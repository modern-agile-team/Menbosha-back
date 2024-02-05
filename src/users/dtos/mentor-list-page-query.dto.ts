import { PageQueryDto } from 'src/common/dto/page-query.dto';
import { User } from '../entities/user.entity';
import { SortOrder } from 'src/common/constants/sort-order.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IsPositiveInt } from 'src/common/decorators/validators/is-positive-int.decorator';
import { MentorOrderField } from '../../mentors/constants/mentor-order-field.enum';

/**
 * @todo create provider enum, mentorOrderField
 */
export class MentorListPageQueryDto
  extends PageQueryDto
  implements Partial<Pick<User, 'id' | 'name' | 'activityCategoryId'>>
{
  @ApiPropertyOptional({
    description: '멘토 고유 ID 필터링',
    format: 'integer',
  })
  @IsOptional()
  @IsPositiveInt()
  id?: number;

  @ApiPropertyOptional({
    description: '멘토 이름 필터링',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: '멘토 활동 카테고리 고유 ID',
    format: 'integer',
    default: 1,
  })
  @IsOptional()
  @IsPositiveInt()
  activityCategoryId: number = 1;

  @ApiPropertyOptional({
    description: '멘토 정렬 필드',
    default: MentorOrderField.id,
    enum: MentorOrderField,
  })
  @IsOptional()
  @IsEnum(MentorOrderField)
  orderField: MentorOrderField = MentorOrderField.id;

  @ApiPropertyOptional({
    description: '오름차순 혹은 내림차순',
    default: SortOrder.ASC,
    enum: SortOrder,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.ASC;
}
