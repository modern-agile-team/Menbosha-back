import { Like, Repository } from 'typeorm';
import { MentorReview } from '../entities/mentor-review.entity';
import { MentorReviewOrderField } from '../constants/mentor-review-order-field.enum';
import { SortOrder } from 'src/common/constants/sort-order.enum';
import { MentorReviewsItemResponseDto } from '../dtos/mentor-reviews-item-response.dto';
import { CustomRepository } from 'src/config/type-orm/decorators/custom-repository.decorator';

@CustomRepository(MentorReview)
export class MentorReviewRepository extends Repository<MentorReview> {
  findMentorReviews(
    skip: number,
    pageSize: number,
    id: number,
    menteeId: number,
    mentorId: number,
    review: string,
    orderField: MentorReviewOrderField,
    sortOrder: SortOrder,
  ): Promise<[MentorReviewsItemResponseDto[], number]> {
    return this.findAndCount({
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
            customCategory: true,
            career: true,
            shortIntro: true,
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
        ...(review ? { review: Like(`%${review}%`) } : {}),
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
}
