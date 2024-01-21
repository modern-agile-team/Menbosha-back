import { ApiProperty } from '@nestjs/swagger';
import { MentorReview } from 'src/mentors/entities/mentor-review.entity';
import { MentorReviewChecklistDto } from './mentor-review-checklist.dto';

export class MentorReviewDto
  implements Omit<MentorReview, 'mentor' | 'mentee' | 'mentorReviewChecklist'>
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
  })
  review: string;

  @ApiProperty({
    description: '멘티가 작성한 리뷰 체크리스트',
    type: MentorReviewChecklistDto,
  })
  mentorReviewChecklistsDto: MentorReviewChecklistDto;

  @ApiProperty({
    description: '생성일자',
  })
  createdAt: Date;
}
