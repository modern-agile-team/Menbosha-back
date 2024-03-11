import { ApiProperty } from '@nestjs/swagger';
import { MentorReviewChecklistCount } from '@src/entities/MentorReviewChecklistCount';
import { Exclude } from 'class-transformer';

export class MentorReviewChecklistCountDto
  implements Omit<MentorReviewChecklistCount, 'mentor'>
{
  @ApiProperty({
    description: '멘토 리뷰 체크리스트 카운트 고유 ID',
    format: 'integer',
    minimum: 1,
  })
  id: number;

  @ApiProperty({
    description: '멘토 리뷰 체크리스트 카운트 멘토 고유 ID',
    format: 'integer',
    minimum: 1,
  })
  mentorId: number;

  @ApiProperty({
    description: '잘가르쳐요 카운트',
    format: 'integer',
    default: 0,
  })
  isGoodWorkCount: number;

  @ApiProperty({
    description: '깔끔해요 카운트',
    format: 'integer',
    default: 0,
  })
  isClearCount: number;

  @ApiProperty({
    description: '답변이 빨라요 카운트',
    format: 'integer',
    default: 0,
  })
  isQuickCount: number;

  @ApiProperty({
    description: '정확해요 카운트',
    format: 'integer',
    default: 0,
  })
  isAccurateCount: number;

  @ApiProperty({
    description: '친절해요 카운트',
    format: 'integer',
    default: 0,
  })
  isKindnessCount: number;

  @ApiProperty({
    description: '재밌어요 카운트',
    format: 'integer',
    default: 0,
  })
  isFunCount: number;

  @ApiProperty({
    description: '알차요 카운트',
    format: 'integer',
    default: 0,
  })
  isInformativeCount: number;

  @ApiProperty({
    description: '아쉬워요 카운트',
    format: 'integer',
    default: 0,
  })
  isBadCount: number;

  @ApiProperty({
    description: '답답해요 카운트',
    format: 'integer',
    default: 0,
  })
  isStuffyCount: number;

  @ApiProperty({
    description: '이해가 잘돼요 카운트',
    format: 'integer',
    default: 0,
  })
  isUnderstandWellCount: number;

  @ApiProperty({
    description: '생성일자',
  })
  createdAt: Date;

  @Exclude()
  deletedAt: Date | null;

  constructor(mentorReviewChecklistCountDto: MentorReviewChecklistCountDto) {
    Object.assign(this, mentorReviewChecklistCountDto);
  }
}
