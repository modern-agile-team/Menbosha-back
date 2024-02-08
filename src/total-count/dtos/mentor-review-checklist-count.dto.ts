import { ApiProperty } from '@nestjs/swagger';
import { MentorReviewChecklistCount } from '../entities/mentor-review-checklist-count.entity';

export class MentorReviewChecklistCountDto
  implements Omit<MentorReviewChecklistCount, 'user'>
{
  @ApiProperty({
    description: '멘토 리뷰 체크리스트 카운트 고유 ID',
    format: 'integer',
    minimum: 1,
  })
  id: number;

  @ApiProperty({
    description: '멘토 리뷰 체크리스트 카운트 유저 고유 ID',
    format: 'integer',
    minimum: 1,
  })
  userId: number;

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
    description: '생성일자',
  })
  createdAt: Date;

  constructor(mentorReviewChecklistCountDto: MentorReviewChecklistCountDto) {
    Object.assign(this, mentorReviewChecklistCountDto);
  }
}
