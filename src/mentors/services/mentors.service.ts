import { Injectable } from '@nestjs/common';
import { MentorsRepository } from '../repositories/mentors.repository';
import { CreateMentorReviewRequestBodyDto } from '../dtos/create-mentor-review-request-body.dto';
import { MentorReviewDto } from '../dtos/mentor-review.dto';
import { MentorReviewChecklistDto } from '../dtos/mentor-review-checklist.dto';

@Injectable()
export class MentorsService {
  constructor(private readonly mentorsRepository: MentorsRepository) {}
  async createMentorReview(
    mentorId: number,
    menteeId: number,
    createMentorReviewRequestBodyDto: CreateMentorReviewRequestBodyDto,
  ): Promise<MentorReviewDto> {
    const { review, createMentorReviewChecklistRequestBodyDto } =
      createMentorReviewRequestBodyDto;

    const { mentorReview, mentorReviewChecklist } =
      await this.mentorsRepository.createMentorReview(
        mentorId,
        menteeId,
        { ...createMentorReviewChecklistRequestBodyDto },
        review,
      );

    return new MentorReviewDto({
      ...mentorReview,
      mentorReviewChecklistsDto: new MentorReviewChecklistDto(
        mentorReviewChecklist,
      ),
    });
  }
}
