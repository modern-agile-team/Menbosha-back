import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserIntroDTO {
  @ApiPropertyOptional({
    example: '안녕하세요',
    description: '한 줄 소개',
  })
  @IsOptional()
  @IsString()
  shortIntro?: string;

  @ApiPropertyOptional({
    example: '숨쉬기 경력 20년',
    description: '경력',
  })
  @IsOptional()
  @IsString()
  career?: string;

  @ApiPropertyOptional({
    example: '코로 숨쉬기, 입으로 숨쉬기',
    description: '커스텀 카테고리',
  })
  @IsOptional()
  @IsString()
  customCategory?: string;

  @ApiPropertyOptional({
    example:
      '안녕하세요. 저는 트위치에서 방송을 하고 있는 스트리머 케인입니다.',
    description: '상세 소개(옵션)',
  })
  @IsOptional()
  @IsString()
  detail?: string;

  @ApiPropertyOptional({
    example: 'https://www.naver.com',
    description: '포트폴리오 링크',
  })
  @IsOptional()
  @IsString()
  portfolio?: string;

  @ApiPropertyOptional({
    example: 'https://www.naver.com',
    description: 'sns 링크',
  })
  @IsOptional()
  @IsString()
  sns?: string;

  @ApiPropertyOptional({
    example: 1,
    description: '희망 카테고리 id',
  })
  @IsOptional()
  @IsNumber()
  hopeCategoryId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: '활동 카테고리 id',
  })
  @IsOptional()
  @IsNumber()
  activityCategoryId?: number;

  @ApiPropertyOptional({
    example: true,
    description: '멘토 여부',
  })
  @IsOptional()
  @IsBoolean()
  isMentor?: boolean;
}
