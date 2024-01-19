import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserRankingDto {
  @ApiProperty({
    description: '유저 아이디',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: '활동 카테고리 아이디',
    example: 1,
  })
  activityCategoryId: number;

  @ApiProperty({
    description: '유저 이름',
    example: '엄준식',
  })
  name: string;

  @ApiProperty({
    description: '세부사항',
    example: '스트리머',
  })
  mainField: string;

  @ApiProperty({
    description: '소개',
    example: '엄.',
  })
  introduce: string;

  @ApiProperty({
    description: '경력',
    example: '존재자체가 경력',
  })
  career: string;

  @ApiProperty({
    description: '점수',
    example: 30,
  })
  rank: number;

  @ApiProperty({
    description: '리뷰 수',
    example: 3,
  })
  countReview: number;
}
