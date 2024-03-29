import { ApiProperty } from '@nestjs/swagger';
import { MentorReview } from '@src/entities/MentorReview';
import { MENTOR_REVIEW_REVIEW_LENGTH } from '@src/mentors/mentor-reviews/constants/mentor-review.constant';
import { Exclude } from 'class-transformer';

export class MentorReviewDto
  implements Omit<MentorReview, 'mentor' | 'mentee'>
{
  @ApiProperty({
    description: '멘토 리뷰 고유 ID',
    format: 'integer',
    minimum: 1,
  })
  id: number;

  @ApiProperty({
    description: '멘토 고유 ID',
    format: 'integer',
    minimum: 1,
  })
  mentorId: number;

  @ApiProperty({
    description: '멘티 고유 ID',
    format: 'integer',
    minimum: 1,
  })
  menteeId: number;

  @ApiProperty({
    description: '멘티가 작성한 리뷰',
    nullable: true,
    type: () => String,
    minLength: MENTOR_REVIEW_REVIEW_LENGTH.MIN,
    maxLength: MENTOR_REVIEW_REVIEW_LENGTH.MAX,
  })
  review: string | null;

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

  @ApiProperty({
    description: '이해가 잘돼요',
    default: false,
  })
  isUnderstandWell: boolean;

  @ApiProperty({
    description: '생성일자',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정 일자',
  })
  updatedAt: Date;

  @Exclude()
  deletedAt: Date | null;

  constructor(mentorReviewDto: MentorReviewDto) {
    Object.assign(this, mentorReviewDto);
  }
}
