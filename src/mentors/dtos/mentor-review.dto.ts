import { MentorReviewChecklist } from 'src/users/entities/mentor-review-checklist.entity';
import { MentorReview } from 'src/users/entities/mentor-review.entity';

export class MentorReviewDto
  implements Omit<MentorReview, 'mentor' | 'mentee'>
{
  id: number;
  mentorId: number;
  menteeId: number;
  review: string;
  mentorReviewChecklists: MentorReviewChecklist[];
  createdAt: Date;
}
