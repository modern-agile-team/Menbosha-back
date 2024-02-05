import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { UserWithImageAndIntroDto } from './user-with-image-and-intro.dto';

export class MentorPaginationResponseDto extends PaginationResponseDto {
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
