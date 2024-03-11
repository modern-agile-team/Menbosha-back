import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsBoolean, IsEnum, IsOptional, Length } from 'class-validator';
import { PageQueryDto } from '@src/common/dto/page-query.dto';
import { SortOrder } from '@src/common/constants/sort-order.enum';
import { IsPositiveInt } from '@src/common/decorators/validators/is-positive-int.decorator';
import { MentorReviewOrderField } from '@src/mentors/mentor-reviews/constants/mentor-review-order-field.enum';
import { Transform } from 'class-transformer';
import { stringToBoolean } from '@src/common/decorators/transformer/string-to-boolean.transformer';
import { MENTOR_REVIEW_REVIEW_LENGTH } from '@src/mentors/mentor-reviews/constants/mentor-review.constant';

export class MentorReviewPageQueryDto extends PageQueryDto {
  @ApiPropertyOptional({
    description: '리뷰 고유 ID 필터링',
    format: 'integer',
    minimum: 1,
  })
  @IsOptional()
  @IsPositiveInt()
  id?: number;

  @ApiPropertyOptional({
    description: '멘티 고유 ID 필터링',
    format: 'integer',
    minimum: 1,
  })
  @IsOptional()
  @IsPositiveInt()
  menteeId?: number;

  @ApiPropertyOptional({
    description: '멘토 리뷰 체크리스트 잘가르쳐요 필터링',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(stringToBoolean)
  isGoodWork?: boolean;

  @ApiPropertyOptional({
    description: '멘토 리뷰 체크리스트 깔끔해요 필터링',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(stringToBoolean)
  isClear?: boolean;

  @ApiPropertyOptional({
    description: '멘토 리뷰 체크리스트 답변이 빨라요 필터링',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(stringToBoolean)
  isQuick?: boolean;

  @ApiPropertyOptional({
    description: '멘토 리뷰 체크리스트 정확해요 필터링',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(stringToBoolean)
  isAccurate?: boolean;

  @ApiPropertyOptional({
    description: '멘토 리뷰 체크리스트 친절해요 필터링',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(stringToBoolean)
  isKindness?: boolean;

  @ApiPropertyOptional({
    description: '멘토 리뷰 체크리스트 재밌어요 필터링',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(stringToBoolean)
  isFun?: boolean;

  @ApiPropertyOptional({
    description: '멘토 리뷰 체크리스트 알차요 필터링',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(stringToBoolean)
  isInformative?: boolean;

  @ApiPropertyOptional({
    description: '멘토 리뷰 체크리스트 아쉬워요 필터링',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(stringToBoolean)
  isBad?: boolean;

  @ApiPropertyOptional({
    description: '멘토 리뷰 체크리스트 답답해요 필터링',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(stringToBoolean)
  isStuffy?: boolean;

  @ApiPropertyOptional({
    description: '멘토 리뷰 체크리스트 이해가 잘돼요 필터링',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(stringToBoolean)
  isUnderstandWell?: boolean;

  @ApiPropertyOptional({
    description: '리뷰 내용 필터링',
    minLength: MENTOR_REVIEW_REVIEW_LENGTH.MIN,
    maxLength: MENTOR_REVIEW_REVIEW_LENGTH.MAX,
  })
  @IsOptional()
  @Length(MENTOR_REVIEW_REVIEW_LENGTH.MIN, MENTOR_REVIEW_REVIEW_LENGTH.MAX)
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
