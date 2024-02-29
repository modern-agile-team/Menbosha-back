import { ApiProperty } from '@nestjs/swagger';
import { Length, Matches } from 'class-validator';
import { BANNED_USER_REASON_LENGTH } from '@src/admins/banned-user/constants/banned-user.constant';
import { BannedUserDto } from '@src/admins/banned-user/dtos/banned-user.dto';
import { ISO_8601_REGEXP } from '@src/common/constants/ISO-8601.regexp';

export class CreateBannedUserBodyDto
  implements
    Omit<BannedUserDto, 'id' | 'banUserId' | 'bannedUserId' | 'bannedAt'>
{
  @ApiProperty({
    description: '정지 사유',
    minLength: 1,
    maxLength: 255,
  })
  @Length(BANNED_USER_REASON_LENGTH.MIN, BANNED_USER_REASON_LENGTH.MAX)
  reason: string;

  @ApiProperty({
    description:
      '정지가 풀리는 날짜. 현재 시간보다 더 미래의 시간으로 요청해야 합니다.',
    format: 'timestamp',
    pattern: String(ISO_8601_REGEXP),
  })
  @Matches(ISO_8601_REGEXP)
  endAt: Date;
}
