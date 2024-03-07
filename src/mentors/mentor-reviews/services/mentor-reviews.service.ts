import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserService } from '@src/users/services/user.service';
import { DataSource, FindOneOptions, UpdateResult } from 'typeorm';
import { isNotEmptyObject } from 'class-validator';
import { CreateMentorReviewRequestBodyDto } from '@src/mentors/mentor-reviews/dtos/create-mentor-review-request-body.dto';
import { MentorReviewPageQueryDto } from '@src/mentors/mentor-reviews/dtos/mentor-review-page-query-dto';
import { MentorReviewDto } from '@src/mentors/mentor-reviews/dtos/mentor-review.dto';
import { MentorReviewsItemResponseDto } from '@src/mentors/mentor-reviews/dtos/mentor-reviews-item-response.dto';
import { MentorReviewsPaginationResponseDto } from '@src/mentors/mentor-reviews/dtos/mentor-reviews-pagination-response.dto';
import { PatchUpdateMentorReviewDto } from '@src/mentors/mentor-reviews/dtos/patch-update-mentor-review.dto';
import { MentorReview } from '@src/mentors/mentor-reviews/entities/mentor-review.entity';
import { MentorReviewRepository } from '@src/mentors/mentor-reviews/repositories/mentor-review.repository';
import { QueryHelper } from '@src/helpers/query.helper';
@Injectable()
export class MentorReviewsService {
  private readonly LIKE_SEARCH_FIELD: readonly (keyof Pick<
    MentorReview,
    'review'
  >)[] = ['review'];

  constructor(
    private readonly dataSource: DataSource,
    private readonly mentorReviewRepository: MentorReviewRepository,
    private readonly userService: UserService,
    private readonly queryHelper: QueryHelper,
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

    let trueCount = 0;

    for (const key in createMentorReviewChecklistRequestBodyDto) {
      if (createMentorReviewChecklistRequestBodyDto[key]) {
        trueCount++;
      }

      if (trueCount > 3) {
        throw new BadRequestException(
          "Can't select more than four checklists.",
        );
      }
    }

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

    const { page, pageSize, orderField, sortOrder, ...filter } =
      mentorReviewPageQueryDto;

    filter['mentorId'] = existMentor.id;

    const where = this.queryHelper.buildWherePropForFind(
      filter,
      this.LIKE_SEARCH_FIELD,
    );

    const order = this.queryHelper.buildOrderByPropForFind(
      orderField,
      sortOrder,
    );

    const skip = (page - 1) * pageSize;

    const [mentorReviews, count] =
      await this.mentorReviewRepository.findMentorReviews(
        skip,
        pageSize,
        where,
        order,
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

  async deleteMentorReview(
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
            mentorId,
            deletedAt: new Date(),
          } as MentorReview,
        );

      await queryRunner.commitTransaction();

      return updateResult;
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
