import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto {
  @ApiProperty({
    description: 'pagination으로 불러온 총 갯수',
  })
  totalCount: number;

  @ApiProperty({
    description: 'pagination 현재 페이지',
  })
  currentPage: number;

  @ApiProperty({
    description: 'pagination 요청한 데이터의 개수',
  })
  pageSize: number;

  @ApiProperty({
    description: 'pagination 다음 페이지',
  })
  nextPage: number;

  @ApiProperty({
    description: 'pagination 다음 페이지 여부',
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'pagination 마지막 페이지',
  })
  lastPage: number;
}
