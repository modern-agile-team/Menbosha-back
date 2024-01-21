import { Injectable } from '@nestjs/common';
import { MentorsRepository } from '../repositories/mentors.repository';
import { CreateMentorReviewRequestBodyDto } from '../dtos/create-mentor-review-request-body.dto';

@Injectable()
export class MentorsService {
  constructor(private readonly mentorsRepository: MentorsRepository) {}
  async createMentorReview(
    mentorId: number,
    menteeId: number,
    createMentorReviewRequestBodyDto: CreateMentorReviewRequestBodyDto,
  ) {
    const { review, createMentorReviewChecklistRequestBodyDto } =
      createMentorReviewRequestBodyDto;

    console.log(mentorId, menteeId, review);

    const mentorReview = await this.mentorsRepository.createMentorReview(
      mentorId,
      menteeId,
      review,
    );

    return mentorReview;
  }
}
