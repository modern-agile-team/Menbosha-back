import { PaginationResponseDto } from '@src/common/dto/pagination-response.dto';
import { MentorReviewsItemResponseDto } from './mentor-reviews-item-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class MentorReviewsPaginationResponseDto extends PaginationResponseDto {
  @ApiProperty({
    description: '멘토 리뷰 조회 item',
    type: [MentorReviewsItemResponseDto],
  })
  mentorReviewsItemResponses: MentorReviewsItemResponseDto[];

  constructor(
    mentorReviewsItemResponseDtos: MentorReviewsItemResponseDto[],
    totalCount: number,
    page: number,
    pageSize: number,
  ) {
    super(totalCount, page, pageSize);

    this.mentorReviewsItemResponses = mentorReviewsItemResponseDtos;
  }
}
