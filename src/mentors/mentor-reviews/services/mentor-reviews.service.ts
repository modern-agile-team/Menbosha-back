import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MentorReviewRepository } from '../repositories/mentor-review.repository';
import { CreateMentorReviewRequestBodyDto } from '../dtos/create-mentor-review-request-body.dto';
import { MentorReviewDto } from '../dtos/mentor-review.dto';
import { MentorReviewPageQueryDto } from '../dtos/mentor-review-page-query-dto';
import { MentorReviewsItemResponseDto } from '../dtos/mentor-reviews-item-response.dto';
import { plainToInstance } from 'class-transformer';
import { MentorReviewsPaginationResponseDto } from '../dtos/mentor-reviews-pagination-response.dto';
import { UserService } from 'src/users/services/user.service';
import { DataSource, FindOneOptions, UpdateResult } from 'typeorm';
import { MentorReview } from '../entities/mentor-review.entity';
import { PatchUpdateMentorReviewDto } from '../dtos/patch-update-mentor-review.dto';
import { isNotEmptyObject } from 'class-validator';
import { MentorReviewChecklistCount } from 'src/total-count/entities/mentor-review-checklist-count.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { MentorReviewChecklistCountsService } from 'src/total-count/services/mentor-review-checklist-counts.service';
@Injectable()
export class MentorReviewsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly mentorReviewRepository: MentorReviewRepository,
    private readonly userService: UserService,
    private readonly mentorReviewChecklistCountsService: MentorReviewChecklistCountsService,
  ) {}
  async createMentorReview(
    mentorId: number,
    menteeId: number,
    createMentorReviewRequestBodyDto: CreateMentorReviewRequestBodyDto,
  ): Promise<MentorReviewDto> {
    if (mentorId === menteeId) {
      throw new ForbiddenException('자기 자신에게 리뷰를 쓸 수 없습니다.');
    }

    const { review, createMentorReviewChecklistRequestBodyDto } =
      createMentorReviewRequestBodyDto;

    const existMentor = await this.userService.findOneByOrNotFound({
      select: {
        id: true,
      },
      where: {
        id: mentorId,
      },
    });

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const mentorReview =
        await this.mentorReviewRepository.createMentorReviewWithEntityManager(
          entityManager,
          existMentor.id,
          menteeId,
          {
            review,
            ...createMentorReviewChecklistRequestBodyDto,
          } as MentorReview,
        );

      const incrementColumns = Object.keys(mentorReview)
        .filter((key) => mentorReview[key] === true)
        .reduce((result, key) => {
          result[`${key}Count`] = () => `${key}Count + 1`;
          return result;
        }, {}) as QueryDeepPartialEntity<MentorReviewChecklistCount>;

      await this.mentorReviewChecklistCountsService.incrementMentorReviewChecklistCounts(
        entityManager,
        mentorId,
        incrementColumns,
      );

      await queryRunner.commitTransaction();

      return new MentorReviewDto({
        ...mentorReview,
      });
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

  async findMentorReviews(
    mentorId: number,
    mentorReviewPageQueryDto: MentorReviewPageQueryDto,
  ): Promise<MentorReviewsPaginationResponseDto> {
    const existMentor = await this.userService.findOneByOrNotFound({
      select: {
        id: true,
      },
      where: {
        id: mentorId,
      },
    });

    const { page, pageSize, id, menteeId, review, orderField, sortOrder } =
      mentorReviewPageQueryDto;

    const skip = (page - 1) * pageSize;

    const [mentorReviews, count] =
      await this.mentorReviewRepository.findMentorReviews(
        skip,
        pageSize,
        id,
        menteeId,
        existMentor.id,
        review,
        orderField,
        sortOrder,
      );

    const mentorReviewsItemResponseDto = plainToInstance(
      MentorReviewsItemResponseDto,
      mentorReviews,
    );

    return new MentorReviewsPaginationResponseDto(
      mentorReviewsItemResponseDto,
      count,
      page,
      pageSize,
    );
  }

  /**
   * TypeORM은 soft delete 기능을 지원.
   * 1. deletedAt 칼럼에 DeleteDateColumn 데코레이터를 달고, softDelete 메서드를 쓰거나 날짜를 직접 new Date()하면 알아서 걸러줌.
   * 2. 날짜를 직접 new Date()로 추가, where 조건에 deletedAt: IsNull()
   */
  async findOneMentorReviewOrFail(
    mentorId: number,
    options: FindOneOptions<MentorReview>,
  ): Promise<MentorReview> {
    await this.userService.findOneByOrNotFound({
      select: {
        id: true,
      },
      where: {
        id: mentorId,
      },
    });

    const existReview = await this.mentorReviewRepository.findOne(options);

    if (!existReview) {
      throw new NotFoundException('해당 멘토에 대한 리뷰를 찾을 수 없습니다.');
    }

    return existReview;
  }

  async findOneMentorReview(
    mentorId: number,
    reviewId: number,
  ): Promise<MentorReviewDto> {
    const existReview = await this.findOneMentorReviewOrFail(mentorId, {
      where: {
        id: reviewId,
        mentorId,
      },
    });

    return new MentorReviewDto(existReview);
  }

  async patchUpdateMentorReview(
    mentorId: number,
    menteeId: number,
    reviewId: number,
    patchUpdateMentorReviewDto: PatchUpdateMentorReviewDto,
  ): Promise<MentorReviewDto> {
    const { review, mentorReviewChecklist } = patchUpdateMentorReviewDto;

    if (!isNotEmptyObject(patchUpdateMentorReviewDto)) {
      throw new BadRequestException('At least one update field must exist.');
    }

    const existReview = await this.findOneMentorReviewOrFail(mentorId, {
      where: {
        mentorId,
        id: reviewId,
      },
    });

    if (existReview.menteeId !== menteeId) {
      throw new ForbiddenException('해당 리뷰에 권한이 없습니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      await this.mentorReviewRepository.updateMentorReviewWithEntityManager(
        entityManager,
        reviewId,
        mentorId,
        menteeId,
        { ...existReview, review, ...mentorReviewChecklist },
      );

      const incrementColumns = Object.entries(mentorReviewChecklist).reduce(
        (result, [key, value]) => {
          if (
            key.startsWith('is') &&
            existReview[key] !== mentorReviewChecklist[key]
          ) {
            const incrementValue = value ? 1 : -1;

            result[`${key}Count`] = () => `${key}Count + ${incrementValue}`;
          }
          return result;
        },
        {},
      ) as QueryDeepPartialEntity<MentorReviewChecklistCount>;

      if (isNotEmptyObject(incrementColumns)) {
        await this.mentorReviewChecklistCountsService.incrementMentorReviewChecklistCounts(
          entityManager,
          mentorId,
          incrementColumns,
        );
      }

      await queryRunner.commitTransaction();

      return new MentorReviewDto({
        ...existReview,
        ...mentorReviewChecklist,
      });
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      console.error(error);

      throw new InternalServerErrorException(
        '멘토 리뷰 업데이트 중 알 수 없는 서버에러 발생',
      );
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }

  async removeMentorReview(
    mentorId: number,
    menteeId: number,
    reviewId: number,
  ): Promise<UpdateResult> {
    const existReview = await this.findOneMentorReviewOrFail(mentorId, {
      where: {
        mentorId,
        id: reviewId,
      },
    });

    if (existReview.menteeId !== menteeId) {
      throw new ForbiddenException('해당 리뷰에 권한이 없습니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const updateResult =
        await this.mentorReviewRepository.updateMentorReviewWithEntityManager(
          entityManager,
          existReview.id,
          existReview.mentorId,
          existReview.menteeId,
          {
            deletedAt: new Date(),
          } as MentorReview,
        );

      const incrementColumns = Object.entries(existReview).reduce(
        (result, [key, value]) => {
          if (value === true) {
            result[`${key}Count`] = () => `${key}Count - 1`;
          }
          return result;
        },
        {},
      ) as QueryDeepPartialEntity<MentorReviewChecklistCount>;

      await this.mentorReviewChecklistCountsService.incrementMentorReviewChecklistCounts(
        entityManager,
        mentorId,
        incrementColumns,
      );

      await queryRunner.commitTransaction();

      return updateResult;
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      console.error(error);

      throw new InternalServerErrorException(
        '멘토 리뷰 업데이트 중 알 수 없는 서버에러 발생',
      );
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }
}
