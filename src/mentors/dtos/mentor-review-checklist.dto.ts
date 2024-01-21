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
  })
  isGoodWork: boolean;

  @ApiProperty({
    description: '깔끔해요',
  })
  isClear: boolean;

  @ApiProperty({
    description: '답변이 빨라요',
  })
  isQuick: boolean;

  @ApiProperty({
    description: '정확해요',
  })
  isAccurate: boolean;

  @ApiProperty({
    description: '친절해요',
  })
  isKindness: boolean;

  @ApiProperty({
    description: '재밌어요',
  })
  isFun: boolean;

  @ApiProperty({
    description: '알차요',
  })
  isInformative: boolean;

  @ApiProperty({
    description: '아쉬워요',
  })
  isBad: boolean;

  @ApiProperty({
    description: '답답해요',
  })
  isStuffy: boolean;

  constructor(mentorReviewChecklistDto: MentorReviewChecklistDto) {
    Object.assign(this, mentorReviewChecklistDto);
  }
}
