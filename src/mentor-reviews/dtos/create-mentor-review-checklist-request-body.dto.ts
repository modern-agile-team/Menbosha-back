import { ApiPropertyOptional } from '@nestjs/swagger';
import { MentorReviewChecklistDto } from './mentor-review-checklist.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class CreateMentorReviewChecklistRequestBodyDto
  implements Partial<MentorReviewChecklistDto>
{
  @ApiPropertyOptional({
    description: '잘가르쳐요',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isGoodWork?: boolean;

  @ApiPropertyOptional({
    description: '깔끔해요',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isClear?: boolean;

  @ApiPropertyOptional({
    description: '답변이 빨라요',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isQuick?: boolean;

  @ApiPropertyOptional({
    description: '정확해요',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isAccurate?: boolean;

  @ApiPropertyOptional({
    description: '친절해요',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isKindness?: boolean;

  @ApiPropertyOptional({
    description: '재밌어요',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFun?: boolean;

  @ApiPropertyOptional({
    description: '알차요',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isInformative?: boolean;

  @ApiPropertyOptional({
    description: '아쉬워요',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isBad?: boolean;

  @ApiPropertyOptional({
    description: '답답해요',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isStuffy?: boolean;

  constructor(
    createMentorReviewChecklistRequestBodyDto: CreateMentorReviewChecklistRequestBodyDto,
  ) {
    Object.assign(this, createMentorReviewChecklistRequestBodyDto);
  }
}
