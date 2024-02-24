import { PaginationResponseDto } from '@src/common/dto/pagination-response.dto';
import { HelpYouCommentWithUserAndUserImageDto } from './help-you-comment-with-user-and-user-image.dto';
import { ApiProperty } from '@nestjs/swagger';

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
