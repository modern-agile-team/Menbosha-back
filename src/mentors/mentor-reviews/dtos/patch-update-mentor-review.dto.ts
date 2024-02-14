import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateMentorReviewChecklistRequestBodyDto } from './create-mentor-review-checklist-request-body.dto';
import { IsNotEmptyObjectAndAllFalse } from 'src/common/decorators/validators/is-not-empty-object-and-all-false.decorator';

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
  })
  @IsOptional()
  @IsString()
  review?: string;
}
