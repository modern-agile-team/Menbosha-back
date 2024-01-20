import { Injectable } from '@nestjs/common';
import { MentorsRepository } from '../repositories/mentors.repository';
import { CreateMentorReviewRequestBodyDto } from '../dtos/create-mentor-review-request-body.dto';

@Injectable()
export class MentorsService {
  constructor(private readonly mentorsRepository: MentorsRepository) {}
  createMentorReview(
    menteeId: number,
    mentorId: number,
    createMentorReviewRequestBodyDto: CreateMentorReviewRequestBodyDto,
  ) {}
}
