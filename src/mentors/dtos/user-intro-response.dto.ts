import { ApiProperty } from '@nestjs/swagger';
import { UserIntro } from 'src/users/entities/user-intro.entity';

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
