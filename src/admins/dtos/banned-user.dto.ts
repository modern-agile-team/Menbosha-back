import { ApiProperty } from '@nestjs/swagger';
import { BannedUser } from 'src/admins/entities/banned-user.entity';

export class BannedUserDto implements Omit<BannedUser, 'user'> {
  @ApiProperty({
    description: '밴된 유저 테이블 고유 ID',
    format: 'integer',
  })
  id: number;

  @ApiProperty({
    description: '유저 고유 ID',
    format: 'integer',
  })
  userId: number;

  @ApiProperty({
    description: '정지 사유',
    maxLength: 200,
  })
  reason: string;

  @ApiProperty({
    description: '정지 당한 날짜',
    format: 'timestamp',
  })
  bannedAt: Date;

  @ApiProperty({
    description: '정지가 풀리는 날짜',
    format: 'timestamp',
  })
  endAt: Date;
}
