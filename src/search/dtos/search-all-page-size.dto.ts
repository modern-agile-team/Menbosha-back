import { ApiProperty } from '@nestjs/swagger';

export class SearchAllPageSizeDto {
  @ApiProperty({
    description: '도와주세요 게시판 검색 최대 페이지',
    format: 'integer',
  })
  helpMeBoardPageSize: number;

  @ApiProperty({ description: '멘토 유저 검색 최대 페이지', format: 'integer' })
  mentorPageSize: number;

  constructor(helpMeBoardsCount: number, mentorsCount: number) {
    this.helpMeBoardPageSize = Math.ceil(helpMeBoardsCount / 10);
    this.mentorPageSize = Math.ceil(mentorsCount / 10);
  }
}
