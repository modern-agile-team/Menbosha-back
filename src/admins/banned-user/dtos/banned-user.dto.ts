import { ApiProperty } from '@nestjs/swagger';
import { BANNED_USER_REASON_LENGTH } from '@src/admins/banned-user/constants/banned-user.constant';
import { BannedUser } from '@src/admins/banned-user/entities/banned-user.entity';

export class BannedUserDto
  implements Omit<BannedUser, 'banUser' | 'bannedUser'>
{
  @ApiProperty({
    description: '밴된 유저 테이블 고유 ID',
    format: 'integer',
  })
  id: number;

  @ApiProperty({
    description: '밴한 어드민 고유 ID',
    format: 'integer',
  })
  banUserId: number;

  @ApiProperty({
    description: '밴 당한 유저 고유 ID',
    format: 'integer',
  })
  bannedUserId: number;

  @ApiProperty({
    description: '정지 사유',
    minLength: BANNED_USER_REASON_LENGTH.MIN,
    maxLength: BANNED_USER_REASON_LENGTH.MAX,
  })
  reason: string;

  @ApiProperty({
    description: '정지 당한 날짜',
    format: 'timestamp',
  })
  bannedAt: Date;

  @ApiProperty({
    description: '정지가 풀리는 날짜',
    format: 'datetime',
  })
  endAt: Date;

  constructor(bannedUserDto: BannedUserDto) {
    Object.assign(this, bannedUserDto);
  }
}
