import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { UserWithImageAndIntroDto } from './user-with-image-and-intro.dto';
import { ApiProperty } from '@nestjs/swagger';

export class MentorPaginationResponseDto extends PaginationResponseDto {
  @ApiProperty({
    type: [UserWithImageAndIntroDto],
    description: '멘토 리스트 item',
  })
  userWithImageAndIntroDtos: UserWithImageAndIntroDto[];

  constructor(
    userWithImageAndIntroDtos: UserWithImageAndIntroDto[],
    totalCount: number,
    page: number,
    pageSize: number,
  ) {
    super(totalCount, page, pageSize);

    this.userWithImageAndIntroDtos = userWithImageAndIntroDtos;
  }
}
