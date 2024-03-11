import { ApiProperty } from '@nestjs/swagger';
import { UserIntro } from '@src/entities/UserIntro';
import {
  USER_CAREER_LENGTH,
  USER_CUSTOM_CATEGORY_LENGTH,
  USER_DETAIL_LENGTH,
  USER_PORTFOLIO_LENGTH,
  USER_SHORT_INTRO_LENGTH,
  USER_SNS_LENGTH,
} from '@src/users/constants/user.constant';
import { Exclude } from 'class-transformer';

export class MyIntroDto implements Omit<UserIntro, 'user'> {
  @Exclude()
  id: number;

  @Exclude()
  userId: number;

  @ApiProperty({
    description: '커스텀 카테고리',
    minLength: USER_CUSTOM_CATEGORY_LENGTH.MIN,
    maxLength: USER_CUSTOM_CATEGORY_LENGTH.MAX,
  })
  customCategory: string;

  @ApiProperty({
    description: '한 줄 소개',
    minLength: USER_SHORT_INTRO_LENGTH.MIN,
    maxLength: USER_SHORT_INTRO_LENGTH.MAX,
  })
  shortIntro: string;

  @ApiProperty({
    description: '경력',
    minLength: USER_CAREER_LENGTH.MIN,
    maxLength: USER_CAREER_LENGTH.MAX,
  })
  career: string;

  @ApiProperty({
    description: '세부 사항',
    minLength: USER_DETAIL_LENGTH.MIN,
    maxLength: USER_DETAIL_LENGTH.MAX,
  })
  detail: string;

  @ApiProperty({
    description: '포트폴리오',
    minLength: USER_PORTFOLIO_LENGTH.MIN,
    maxLength: USER_PORTFOLIO_LENGTH.MAX,
  })
  portfolio: string;

  @ApiProperty({
    description: 'SNS',
    minLength: USER_SNS_LENGTH.MIN,
    maxLength: USER_SNS_LENGTH.MAX,
  })
  sns: string;

  constructor(myIntro: Partial<MyIntroDto> = {}) {
    Object.assign(this, myIntro);
  }
}
