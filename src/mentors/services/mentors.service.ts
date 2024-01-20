import { Injectable } from '@nestjs/common';
import { MentorsRepository } from '../repositories/mentors.repository';

@Injectable()
export class MentorsService {
  constructor(private readonly mentorsRepository: MentorsRepository) {}
  createMentorReview(menteeId: number, mentorId: number) {}
}
