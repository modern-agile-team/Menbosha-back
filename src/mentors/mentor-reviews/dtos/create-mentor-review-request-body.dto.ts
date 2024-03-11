import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsNotEmptyObjectAndAllFalse } from '@src/common/decorators/validators/is-not-empty-object-and-all-false.decorator';
import { MentorReviewDto } from '@src/mentors/mentor-reviews/dtos/mentor-review.dto';
import { CreateMentorReviewChecklistRequestBodyDto } from '@src/mentors/mentor-reviews/dtos/create-mentor-review-checklist-request-body.dto';
import { MENTOR_REVIEW_REVIEW_LENGTH } from '@src/mentors/mentor-reviews/constants/mentor-review.constant';

export class CreateMentorReviewRequestBodyDto
  implements Partial<MentorReviewDto>
{
  @ApiProperty({
    description: '멘토 리뷰 체크리스트 객체',
    type: CreateMentorReviewChecklistRequestBodyDto,
  })
  @ValidateNested()
  @Type(() => CreateMentorReviewChecklistRequestBodyDto)
  @IsNotEmptyObjectAndAllFalse()
  createMentorReviewChecklistRequestBodyDto: CreateMentorReviewChecklistRequestBodyDto;

  @ApiPropertyOptional({
    description: '멘토 리뷰 내용',
    minLength: MENTOR_REVIEW_REVIEW_LENGTH.MIN,
    maxLength: MENTOR_REVIEW_REVIEW_LENGTH.MAX,
  })
  @IsOptional()
  @Length(MENTOR_REVIEW_REVIEW_LENGTH.MIN, MENTOR_REVIEW_REVIEW_LENGTH.MAX)
  review?: string;
}
