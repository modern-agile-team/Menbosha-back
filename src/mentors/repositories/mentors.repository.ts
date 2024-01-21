import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, FindOneOptions, Like, Repository } from 'typeorm';
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

  findMentorReviews(
    skip,
    pageSize,
    id,
    menteeId,
    mentorId,
    review,
    orderField,
    sortOrder,
  ) {
    return this.dataSource.manager.getRepository(MentorReview).findAndCount({
      select: {
        id: true,
        mentee: {
          id: true,
          name: true,
          rank: true,
          userImage: {
            imageUrl: true,
          },
          userIntro: {
            mainField: true,
            career: true,
            introduce: true,
          },
        },
        mentorReviewChecklist: {
          id: true,
          mentorReviewId: true,
          isGoodWork: true,
          isClear: true,
          isQuick: true,
          isAccurate: true,
          isKindness: true,
          isFun: true,
          isInformative: true,
          isBad: true,
          isStuffy: true,
        },
        review: true,
        createdAt: true,
      },
      where: {
        mentorId,
        ...(id ? { id } : {}),
        ...(menteeId ? { menteeId } : {}),
        ...(review ? { review: Like(review) } : {}),
      },
      relations: {
        mentee: {
          userImage: true,
          userIntro: true,
        },
        mentorReviewChecklist: true,
      },
      order: {
        [orderField]: sortOrder,
      },
      skip,
      take: pageSize,
    });
  }

  findOneMentorReview(options: FindOneOptions<MentorReview>) {
    return this.dataSource.manager.getRepository(MentorReview).findOne(options);
  }

  async removeMentorReview(
    reviewId: number,
    mentorId: number,
    menteeId: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const mentorReviewUpdateResult = await entityManager
        .withRepository(this.mentorReviewRepository)
        .update(
          {
            id: reviewId,
            mentorId,
            menteeId,
          },
          {
            deletedAt: new Date(),
          },
        );

      if (!mentorReviewUpdateResult.affected) {
        throw new InternalServerErrorException(
          '멘토 리뷰 삭제 중 알 수 없는 서버에러 발생',
        );
      }

      const mentorReviewChecklistUpdateResult = await entityManager
        .withRepository(this.mentorReviewChecklistRepository)
        .update(
          {
            mentorReviewId: reviewId,
          },
          {
            deletedAt: new Date(),
          },
        );

      if (!mentorReviewChecklistUpdateResult.affected) {
        throw new InternalServerErrorException(
          '멘토 리뷰 체크리스트 삭제 중 알 수 없는 서버에러 발생',
        );
      }

      await queryRunner.commitTransaction();

      return { mentorReviewUpdateResult, mentorReviewChecklistUpdateResult };
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      console.error(error);

      throw new InternalServerErrorException(
        '멘토 리뷰 삭제 중 알 수 없는 서버에러 발생',
      );
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }
}
