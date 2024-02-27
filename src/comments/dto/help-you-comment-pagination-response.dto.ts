import { PaginationResponseDto } from '@src/common/dto/pagination-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { HelpYouCommentWithUserAndUserImageDto } from '@src/comments/dto/help-you-comment-with-user-and-user-image.dto';

export class HelpYouCommentPaginationResponseDto extends PaginationResponseDto {
  @ApiProperty({
    type: [HelpYouCommentWithUserAndUserImageDto],
    description: '도와줄게요 댓글 item',
  })
  helpYouCommentWithUserAndUserImagesItemDto: HelpYouCommentWithUserAndUserImageDto[];

  constructor(
    helpYouCommentWithUserAndUserImagesItemDto: HelpYouCommentWithUserAndUserImageDto[],
    totalCount: number,
    page: number,
    pageSize: number,
  ) {
    super(totalCount, page, pageSize);

    this.helpYouCommentWithUserAndUserImagesItemDto =
      helpYouCommentWithUserAndUserImagesItemDto;
  }
}
