import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateMentorReviewChecklistRequestBodyDto } from '../dtos/create-mentor-review-checklist-request-body.dto';
import { MentorReviewChecklist } from '../entities/mentor-review-checklist.entity';
import { MentorReview } from '../entities/mentor-review.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MentorsRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(MentorReview)
    private readonly mentorReviewRepository: Repository<MentorReview>,
    @InjectRepository(MentorReviewChecklist)
    private readonly mentorReviewChecklistRepository: Repository<MentorReviewChecklist>,
  ) {}

  async createMentorReview(
    mentorId: number,
    menteeId: number,
    createMentorReviewChecklistRequestBodyDto: CreateMentorReviewChecklistRequestBodyDto,
    review?: string,
  ): Promise<{
    mentorReview: MentorReview;
    mentorReviewChecklist: MentorReviewChecklist;
  }> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const mentorReview = await entityManager
        .withRepository(this.mentorReviewRepository)
        .save({
          mentorId,
          menteeId,
          review,
        });

      const mentorReviewChecklist = await entityManager
        .withRepository(this.mentorReviewChecklistRepository)
        .save({
          mentorReviewId: mentorReview.id,
          ...createMentorReviewChecklistRequestBodyDto,
        });

      await queryRunner.commitTransaction();

      return { mentorReview, mentorReviewChecklist };
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      console.error(error);

      throw new InternalServerErrorException(
        '멘토 리뷰 생성 중 알 수 없는 서버에러 발생',
      );
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }
}
