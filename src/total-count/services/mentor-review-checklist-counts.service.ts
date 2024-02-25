import { Injectable } from '@nestjs/common';
import { MentorReviewChecklistCountDto } from '@src/total-count/dtos/mentor-review-checklist-count.dto';
import { MentorReviewChecklistCountRepository } from '@src/total-count/repositories/mentor-review-checklist-count.repository';

@Injectable()
export class MentorReviewChecklistCountsService {
  constructor(
    private readonly mentorReviewChecklistRepository: MentorReviewChecklistCountRepository,
  ) {}

  async findOneMentorReviewChecklistCountOrFail(
    userId: number,
  ): Promise<MentorReviewChecklistCountDto> {
    const mentorReviewChecklistCount =
      await this.mentorReviewChecklistRepository.findOneMentorReviewChecklistCount(
        userId,
      );

    return new MentorReviewChecklistCountDto(mentorReviewChecklistCount);
  }
}
