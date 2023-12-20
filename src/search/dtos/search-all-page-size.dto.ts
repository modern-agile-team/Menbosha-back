import { ApiProperty } from '@nestjs/swagger';

export class SearchAllPageSizeDto {
  @ApiProperty({ description: '도와주세요 게시판 검색 최대 페이지' })
  helpMeBoardPageSize: number;

  @ApiProperty({ description: '멘토 유저 검색 최대 페이지' })
  mentorPageSize: number;

  constructor(searchAllPageSizeDto: Partial<SearchAllPageSizeDto>) {
    Object.assign(Math.ceil(searchAllPageSizeDto / 10), this);
  }
}
