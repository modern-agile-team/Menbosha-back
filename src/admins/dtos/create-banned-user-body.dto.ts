import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { BANNED_USER_LENGTH } from 'src/admins/constants/banned-user.constant';
import { BannedUserDto } from 'src/admins/dtos/banned-user.dto';
import { IsAfterDateAndISO8601 } from 'src/admins/dtos/validators/is-after-date-and-iso-8607.validator';
import { ISO_8601_REGEXP } from 'src/common/constants/ISO-8601.regexp';

export class CreateBannedUserBodyDto
  implements Omit<BannedUserDto, 'id' | 'userId' | 'bannedAt'>
{
  @ApiProperty({
    description: '정지 사유',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @Length(BANNED_USER_LENGTH.MIN, BANNED_USER_LENGTH.MAX)
  reason: string;

  @ApiProperty({
    description: '정지가 풀리는 날짜',
    format: 'timestamp',
    pattern: String(ISO_8601_REGEXP),
  })
  @IsAfterDateAndISO8601()
  endAt: Date;
}
