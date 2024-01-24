import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserIntroDTO {
  @ApiProperty({
    example: '안녕하세요',
    description: '한 줄 소개',
  })
  @IsString()
  shortIntro: string;

  @ApiProperty({
    example: '숨쉬기 경력 20년',
    description: '경력',
  })
  @IsString()
  career: string;

  @ApiProperty({
    example: '코로 숨쉬기, 입으로 숨쉬기',
    description: '커스텀 카테고리',
  })
  @IsString()
  customCategory: string;

  @ApiProperty({
    example:
      '안녕하세요. 저는 트위치에서 방송을 하고 있는 스트리머 케인입니다.',
    description: '상세 소개(옵션)',
  })
  @IsOptional()
  @IsString()
  detail?: string;

  @ApiProperty({
    example: 'https://www.naver.com',
    description: '포트폴리오 링크(옵션)',
  })
  @IsOptional()
  @IsString()
  portfolio?: string;

  @ApiProperty({
    example: 'https://www.naver.com',
    description: 'sns 링크(옵션)',
  })
  @IsOptional()
  @IsString()
  sns?: string;
}
