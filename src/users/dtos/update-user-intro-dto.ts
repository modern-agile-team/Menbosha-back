import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsPositiveInt } from '@src/common/decorators/validators/is-positive-int.decorator';
import {
  USER_CAREER_LENGTH,
  USER_CUSTOM_CATEGORY_LENGTH,
  USER_DETAIL_LENGTH,
  USER_PORTFOLIO_LENGTH,
  USER_SHORT_INTRO_LENGTH,
  USER_SNS_LENGTH,
} from '@src/users/constants/user.constant';
import { IsBoolean, IsOptional, Length } from 'class-validator';

export class UpdateUserIntroDTO {
  @ApiPropertyOptional({
    example: '안녕하세요',
    description: '한 줄 소개',
    minLength: USER_SHORT_INTRO_LENGTH.MIN,
    maxLength: USER_SHORT_INTRO_LENGTH.MAX,
  })
  @IsOptional()
  @Length(USER_SHORT_INTRO_LENGTH.MIN, USER_SHORT_INTRO_LENGTH.MAX)
  shortIntro?: string;

  @ApiPropertyOptional({
    example: '숨쉬기 경력 20년',
    description: '경력',
    minLength: USER_CAREER_LENGTH.MIN,
    maxLength: USER_CAREER_LENGTH.MAX,
  })
  @IsOptional()
  @Length(USER_CAREER_LENGTH.MIN, USER_CAREER_LENGTH.MAX)
  career?: string;

  @ApiPropertyOptional({
    example: '코로 숨쉬기, 입으로 숨쉬기',
    description: '커스텀 카테고리',
    minLength: USER_CUSTOM_CATEGORY_LENGTH.MIN,
    maxLength: USER_CUSTOM_CATEGORY_LENGTH.MAX,
  })
  @IsOptional()
  @Length(USER_CUSTOM_CATEGORY_LENGTH.MIN, USER_CUSTOM_CATEGORY_LENGTH.MAX)
  customCategory?: string;

  @ApiPropertyOptional({
    example:
      '안녕하세요. 저는 트위치에서 방송을 하고 있는 스트리머 케인입니다.',
    description: '상세 소개(옵션)',
    minLength: USER_DETAIL_LENGTH.MIN,
    maxLength: USER_DETAIL_LENGTH.MAX,
  })
  @IsOptional()
  @Length(USER_DETAIL_LENGTH.MIN, USER_DETAIL_LENGTH.MAX)
  detail?: string;

  @ApiPropertyOptional({
    example: 'https://www.naver.com',
    description: '포트폴리오 링크',
    minLength: USER_PORTFOLIO_LENGTH.MIN,
    maxLength: USER_PORTFOLIO_LENGTH.MAX,
  })
  @IsOptional()
  @Length(USER_PORTFOLIO_LENGTH.MIN, USER_PORTFOLIO_LENGTH.MAX)
  portfolio?: string;

  @ApiPropertyOptional({
    example: 'https://www.naver.com',
    description: 'sns 링크',
    minLength: USER_SNS_LENGTH.MIN,
    maxLength: USER_SNS_LENGTH.MAX,
  })
  @IsOptional()
  @Length(USER_SNS_LENGTH.MIN, USER_SNS_LENGTH.MAX)
  sns?: string;

  @ApiPropertyOptional({
    example: 1,
    description: '희망 카테고리 id',
  })
  @IsOptional()
  @IsPositiveInt()
  hopeCategoryId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: '활동 카테고리 id',
  })
  @IsOptional()
  @IsPositiveInt()
  activityCategoryId?: number;

  @ApiPropertyOptional({
    example: true,
    description: '멘토 여부',
  })
  @IsOptional()
  @IsBoolean()
  isMentor?: boolean;
}
