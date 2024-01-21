import { ApiProperty } from '@nestjs/swagger';
import { MentorReviewChecklist } from 'src/mentors/entities/mentor-review-checklist.entity';

export class MentorReviewChecklistDto
  implements Omit<MentorReviewChecklist, 'mentorReview'>
{
  @ApiProperty({
    description: '멘토 리뷰 체크리스트 고유 ID',
    format: 'integer',
    minimum: 1,
  })
  id: number;

  @ApiProperty({
    description: '멘토 리뷰 고유 ID',
    format: 'integer',
    minimum: 1,
  })
  mentorReviewId: number;

  @ApiProperty({
    description: '잘가르쳐요',
    default: false,
  })
  isGoodWork: boolean;

  @ApiProperty({
    description: '깔끔해요',
    default: false,
  })
  isClear: boolean;

  @ApiProperty({
    description: '답변이 빨라요',
    default: false,
  })
  isQuick: boolean;

  @ApiProperty({
    description: '정확해요',
    default: false,
  })
  isAccurate: boolean;

  @ApiProperty({
    description: '친절해요',
    default: false,
  })
  isKindness: boolean;

  @ApiProperty({
    description: '재밌어요',
    default: false,
  })
  isFun: boolean;

  @ApiProperty({
    description: '알차요',
    default: false,
  })
  isInformative: boolean;

  @ApiProperty({
    description: '아쉬워요',
    default: false,
  })
  isBad: boolean;

  @ApiProperty({
    description: '답답해요',
    default: false,
  })
  isStuffy: boolean;

  constructor(mentorReviewChecklistDto: MentorReviewChecklistDto) {
    Object.assign(this, mentorReviewChecklistDto);
  }
}
