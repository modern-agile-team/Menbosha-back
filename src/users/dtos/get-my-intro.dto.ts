import { ApiProperty } from '@nestjs/swagger';
import { UserIntro } from '@src/users/entities/user-intro.entity';
import { Exclude } from 'class-transformer';

export class MyIntroDto implements Omit<UserIntro, 'user'> {
  @Exclude()
  id: number;

  @Exclude()
  userId: number;

  @ApiProperty({
    description: '커스텀 카테고리',
  })
  customCategory: string;

  @ApiProperty({
    description: '한 줄 소개',
  })
  shortIntro: string;

  @ApiProperty({
    description: '경력',
  })
  career: string;

  @ApiProperty({
    description: '세부 사항',
  })
  detail: string;

  @ApiProperty({
    description: '포트폴리오',
  })
  portfolio: string;

  @ApiProperty({
    description: 'SNS',
  })
  sns: string;

  constructor(myIntro: Partial<MyIntroDto> = {}) {
    Object.assign(this, myIntro);
  }
}
