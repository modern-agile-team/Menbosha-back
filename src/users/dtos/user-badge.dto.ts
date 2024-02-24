import { ApiProperty } from '@nestjs/swagger';
import { UserBadge } from '@src/users/entities/user-badge.entity';
import { Exclude } from 'class-transformer';

export class UserBadgeDto implements Omit<UserBadge, 'user' | 'badge'> {
  @ApiProperty({
    description: '유저 뱃지 아이디',
  })
  @Exclude()
  id: number;

  @ApiProperty({
    description: '유저 아이디',
  })
  @Exclude()
  userId: number;

  @ApiProperty({
    description: '뱃지 아이디',
  })
  badgeId: number;

  @ApiProperty({
    description: '뱃지 생성 날짜',
  })
  createdAt: Date;

  constructor(userBadge: Partial<UserBadgeDto> = {}) {
    Object.assign(this, userBadge);
  }
}
