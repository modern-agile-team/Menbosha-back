import { ApiPropertyOptional } from '@nestjs/swagger';
import { BannedUserOrderField } from '@src/admins/banned-user/constants/banned-user-order-field.enum';
import { BANNED_USER_REASON_LENGTH } from '@src/admins/banned-user/constants/banned-user.constant';
import { SortOrder } from '@src/common/constants/sort-order.enum';
import { IsPositiveInt } from '@src/common/decorators/validators/is-positive-int.decorator';
import { PageQueryDto } from '@src/common/dto/page-query.dto';
import { IsEnum, IsOptional, Length } from 'class-validator';

export class BannedUserPageQueryDto extends PageQueryDto {
  @ApiPropertyOptional({
    description: '밴한 유저 테이블 고유 ID 필터링',
    format: 'integer',
  })
  @IsOptional()
  @IsPositiveInt()
  id?: number;

  @ApiPropertyOptional({
    description: '밴한 유저 고유 ID 필터링',
    format: 'integer',
  })
  @IsOptional()
  @IsPositiveInt()
  banUserId?: number;

  @ApiPropertyOptional({
    description: '밴 당한 유저 고유 ID 필터링',
    format: 'integer',
  })
  @IsOptional()
  @IsPositiveInt()
  bannedUserId?: number;

  @ApiPropertyOptional({
    description: '정지 사유 필터링',
    minLength: BANNED_USER_REASON_LENGTH.MIN,
    maxLength: BANNED_USER_REASON_LENGTH.MAX,
  })
  @IsOptional()
  @Length(BANNED_USER_REASON_LENGTH.MIN, BANNED_USER_REASON_LENGTH.MAX)
  reason?: string;

  @ApiPropertyOptional({
    description: '밴 유저 테이블 정렬 필드',
    default: BannedUserOrderField.Id,
    enum: BannedUserOrderField,
  })
  @IsOptional()
  @IsEnum(BannedUserOrderField)
  orderField: BannedUserOrderField = BannedUserOrderField.Id;

  @ApiPropertyOptional({
    description: '오름차순 혹은 내림차순',
    default: SortOrder.ASC,
    enum: SortOrder,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.ASC;
}
