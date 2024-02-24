import { PaginationResponseDto } from '@src/common/dto/pagination-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { HelpMeBoardWithUserAndImagesDto } from './help-me-board-with-user-and-images.dto';

export class HelpMeBoardPaginationResponseDto extends PaginationResponseDto {
  @ApiProperty({
    type: [HelpMeBoardWithUserAndImagesDto],
    description: '도와주세요 게시판 item',
  })
  helpMeBoardWithUserAndImagesItemDto: HelpMeBoardWithUserAndImagesDto[];

  constructor(
    helpMeBoardWithUserAndImagesItemDto: HelpMeBoardWithUserAndImagesDto[],
    totalCount: number,
    page: number,
    pageSize: number,
  ) {
    super(totalCount, page, pageSize);

    this.helpMeBoardWithUserAndImagesItemDto =
      helpMeBoardWithUserAndImagesItemDto;
  }
}
