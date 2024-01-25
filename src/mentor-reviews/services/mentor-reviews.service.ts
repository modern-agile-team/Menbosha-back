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
import { MentorBoardPageQueryDto } from '../dtos/mentor-review-page-query-dto';
import { MentorReviewsItemResponseDto } from '../dtos/mentor-reviews-item-response.dto';
import { plainToInstance } from 'class-transformer';
import { MentorReviewsPaginationResponseDto } from '../dtos/mentor-reviews-pagination-response.dto';
import { UserService } from 'src/users/services/user.service';
import { DataSource, EntityManager, FindOneOptions } from 'typeorm';
import { MentorReview } from '../entities/mentor-review.entity';
import { PatchUpdateMentorReviewDto } from '../dtos/patch-update-mentor-review.dto';
import { isNotEmptyObject } from 'class-validator';
import { MentorReviewChecklistService } from '../mentor-review-checklist/services/mentor-review-checklist.service';
@Injectable()
export class MentorReviewsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly mentorReviewChecklistService: MentorReviewChecklistService,
    private readonly mentorReviewRepository: MentorReviewRepository,
    private readonly userService: UserService,
  ) {}
  async createMentorReview(
    mentorId: number,
    menteeId: number,
    createMentorReviewRequestBodyDto: CreateMentorReviewRequestBodyDto,
  ): Promise<MentorReviewDto> {
    const existMentor = await this.userService.findOneByOrNotFound({
      select: {
        id: true,
      },
      where: {
        id: mentorId,
        isMentor: true,
      },
    });

    const { review, createMentorReviewChecklistRequestBodyDto } =
      createMentorReviewRequestBodyDto;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const mentorReview = await entityManager
        .withRepository(this.mentorReviewRepository)
        .save({
          mentorId: existMentor.id,
          menteeId,
          review,
        });

      const mentorReviewChecklist =
        await this.mentorReviewChecklistService.createMentorReviewChecklist(
          entityManager,
          mentorReview.id,
          { ...createMentorReviewChecklistRequestBodyDto },
        );

      await queryRunner.commitTransaction();

      return new MentorReviewDto({
        ...mentorReview,
        mentorReviewChecklist,
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
    mentorBoardPageQueryDto: MentorBoardPageQueryDto,
  ): Promise<MentorReviewsPaginationResponseDto> {
    const existMentor = await this.userService.findOneByOrNotFound({
      select: {
        id: true,
      },
      where: {
        id: mentorId,
        isMentor: true,
      },
    });

    const { page, pageSize, id, menteeId, review, orderField, sortOrder } =
      mentorBoardPageQueryDto;

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
        isMentor: true,
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
      relations: {
        mentorReviewChecklist: true,
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
    const { mentorReviewChecklist, review } = patchUpdateMentorReviewDto;

    if (!isNotEmptyObject(patchUpdateMentorReviewDto)) {
      throw new BadRequestException('At least one update field must exist.');
    }

    const existReview = await this.findOneMentorReviewOrFail(mentorId, {
      where: {
        mentorId,
        id: reviewId,
      },
      relations: {
        mentorReviewChecklist: true,
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

      if (review !== undefined) {
        await this.updateMentorReview(
          entityManager,
          existReview.id,
          existReview.mentorId,
          existReview.menteeId,
          review,
        );
      }

      if (mentorReviewChecklist !== undefined) {
        await this.mentorReviewChecklistService.patchUpdateMentorReviewChecklist(
          entityManager,
          existReview.id,
          mentorReviewChecklist,
        );
      }

      await queryRunner.commitTransaction();

      const updatedMentorReview = {
        ...existReview,
        ...patchUpdateMentorReviewDto,
        mentorReviewChecklist: {
          ...existReview.mentorReviewChecklist,
          ...mentorReviewChecklist,
        },
      };

      return new MentorReviewDto(updatedMentorReview);
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      console.error(error);

      throw new InternalServerErrorException(
        '멘토 리뷰 업데이트 중 에러가 발생했습니다.',
      );
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }

  private async updateMentorReview(
    entityManager: EntityManager,
    reviewId: number,
    mentorId: number,
    menteeId: number,
    review: string,
  ): Promise<void> {
    await entityManager.withRepository(this.mentorReviewRepository).update(
      {
        id: reviewId,
        mentorId,
        menteeId,
      },
      { review },
    );
  }

  async removeMentorReview(
    mentorId: number,
    menteeId: number,
    reviewId: number,
  ): Promise<void> {
    const existReview = await this.findOneMentorReviewOrFail(mentorId, {
      select: ['id', 'menteeId', 'mentorId'],
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

      await entityManager.withRepository(this.mentorReviewRepository).update(
        {
          id: existReview.id,
          mentorId: existReview.mentorId,
          menteeId: existReview.menteeId,
        },
        {
          deletedAt: new Date(),
        },
      );

      await this.mentorReviewChecklistService.removeMentorReviewChecklist(
        entityManager,
        existReview.id,
      );

      await queryRunner.commitTransaction();
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
