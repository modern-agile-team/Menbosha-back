import { MentorReviewDto } from './mentor-review.dto';
import { CreateMentorReviewChecklistRequestBodyDto } from './create-mentor-review-checklist-request-body.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsNotEmptyObjectAndAllFalse } from '@src/common/decorators/validators/is-not-empty-object-and-all-false.decorator';

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
  })
  @IsOptional()
  @IsString()
  review?: string;
}
