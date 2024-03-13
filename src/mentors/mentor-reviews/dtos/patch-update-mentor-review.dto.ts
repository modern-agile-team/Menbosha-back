import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Length, ValidateNested } from 'class-validator';
import { IsNotEmptyObjectAndAllFalse } from '@src/common/decorators/validators/is-not-empty-object-and-all-false.decorator';
import { CreateMentorReviewChecklistRequestBodyDto } from '@src/mentors/mentor-reviews/dtos/create-mentor-review-checklist-request-body.dto';
import { MENTOR_REVIEW_REVIEW_LENGTH } from '@src/mentors/mentor-reviews/constants/mentor-review.constant';

export class PatchUpdateMentorReviewDto {
  @ApiPropertyOptional({
    description: '멘토 리뷰 체크리스트 객체',
    type: CreateMentorReviewChecklistRequestBodyDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMentorReviewChecklistRequestBodyDto)
  @IsNotEmptyObjectAndAllFalse()
  mentorReviewChecklist?: CreateMentorReviewChecklistRequestBodyDto;

  @ApiPropertyOptional({
    description: '멘토 리뷰 내용',
    minLength: MENTOR_REVIEW_REVIEW_LENGTH.MIN,
    maxLength: MENTOR_REVIEW_REVIEW_LENGTH.MAX,
  })
  @IsOptional()
  @Length(MENTOR_REVIEW_REVIEW_LENGTH.MIN, MENTOR_REVIEW_REVIEW_LENGTH.MAX)
  review?: string;
}
