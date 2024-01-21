import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateMentorReviewChecklistRequestBodyDto } from './create-mentor-review-checklist-request-body.dto';

export class PatchUpdateMentorReviewDto {
  @ApiPropertyOptional({
    description: '멘토 리뷰 체크리스트 객체',
    type: CreateMentorReviewChecklistRequestBodyDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMentorReviewChecklistRequestBodyDto)
  @IsNotEmptyObject()
  mentorReviewChecklist?: CreateMentorReviewChecklistRequestBodyDto;

  @ApiPropertyOptional({
    description: '멘토 리뷰 내용',
  })
  @IsOptional()
  @IsString()
  review?: string;
}
