import { ApiProperty } from '@nestjs/swagger';
import { UserIntro } from '@src/entities/UserIntro';

export class UserIntroResponseDto
  implements Pick<UserIntro, 'shortIntro' | 'customCategory'>
{
  @ApiProperty({
    description: '멘토 짧은 소개',
  })
  shortIntro: string;

  @ApiProperty({
    description: '멘토 커스텀 카테고리',
  })
  customCategory: string;
}
