import { ApiProperty } from '@nestjs/swagger';
import { BannedUserDto } from '@src/admins/banned-user/dtos/banned-user.dto';

export class BannedUsersItemDto implements Omit<BannedUserDto, 'reason'> {
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
    description: '정지 당한 날짜',
    format: 'timestamp',
  })
  bannedAt: Date;

  @ApiProperty({
    description: '정지가 풀리는 날짜',
    format: 'datetime',
  })
  endAt: Date;

  constructor(bannedUsersItemDto: BannedUsersItemDto) {
    Object.assign(this, bannedUsersItemDto);
  }
}
