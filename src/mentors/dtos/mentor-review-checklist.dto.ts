import { MentorReviewChecklist } from 'src/mentors/entities/mentor-review-checklist.entity';

export class MentorReviewChecklistDto
  implements Omit<MentorReviewChecklist, 'mentorReview'>
{
  id: number;
  mentorReviewId: number;
  isGoodWork: boolean;
  isClear: boolean;
  isQuick: boolean;
  isAccurate: boolean;
  isKindness: boolean;
  isFun: boolean;
  isInformative: boolean;
  isBad: boolean;
  isStuffy: boolean;
}
