import { MentorReviewChecklist } from 'src/users/entities/mentor-review-checklist.entity';

export class MentorReviewChecklistDto
  implements Omit<MentorReviewChecklist, 'mentorReview'>
{
  id: number;
  mentorReviewId: number;
  isAccurate: boolean;
  isBad: boolean;
  isClear: boolean;
  isFun: boolean;
  isGoodWork: boolean;
  isInformative: boolean;
  isKindness: boolean;
  isQuick: boolean;
  isStuffy: boolean;
}
