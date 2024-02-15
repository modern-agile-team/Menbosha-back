import { Injectable } from '@nestjs/common';
import { MentorReviewChecklistCountRepository } from '../repositories/mentor-review-checklist-count.repository';
import { MentorReviewChecklistCountDto } from '../dtos/mentor-review-checklist-count.dto';

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
