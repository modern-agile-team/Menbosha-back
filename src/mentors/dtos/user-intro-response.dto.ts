import { ApiProperty } from '@nestjs/swagger';
import { UserIntro } from '@src/entities/UserIntro';
import {
  USER_CUSTOM_CATEGORY_LENGTH,
  USER_SHORT_INTRO_LENGTH,
} from '@src/users/constants/user.constant';

export class UserIntroResponseDto
  implements Pick<UserIntro, 'shortIntro' | 'customCategory'>
{
  @ApiProperty({
    description: '멘토 짧은 소개',
    minLength: USER_SHORT_INTRO_LENGTH.MIN,
    maxLength: USER_SHORT_INTRO_LENGTH.MAX,
  })
  shortIntro: string;

  @ApiProperty({
    description: '멘토 커스텀 카테고리',
    minLength: USER_CUSTOM_CATEGORY_LENGTH.MIN,
    maxLength: USER_CUSTOM_CATEGORY_LENGTH.MAX,
  })
  customCategory: string;
}
