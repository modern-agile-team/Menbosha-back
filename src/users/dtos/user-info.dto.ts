import { Exclude } from 'class-transformer';
import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from 'src/users/constants/user-status.enum';

export class UserInfoDto
  implements
    Omit<
      User,
      | 'userImage'
      | 'userIntro'
      | 'mentor'
      | 'mentee'
      | 'mentorBoard'
      | 'helpMeBoard'
      | 'userBadge'
      | 'token'
      | 'categoryList'
      | 'totalCount'
      | 'mentorBoardLikes'
      | 'userRanking'
      | 'mentorReviewChecklistCount'
      | 'reports'
      | 'banned'
      | 'bans'
      | 'reported'
      | 'bannedUser'
      | 'uniqueId'
    >
{
  @ApiProperty({
    description: '유저 아이디',
  })
  id: number;

  @ApiProperty({
    description: '이름',
  })
  name: string;

  @ApiProperty({
    description: '이메일',
  })
  email: string;

  @ApiProperty({
    description: '관리자 여부',
  })
  admin: boolean;

  @ApiProperty({
    description: '멘토 여부',
  })
  isMentor: boolean;

  @ApiProperty({
    description: '희망 카테고리 id',
  })
  hopeCategoryId: number;

  @ApiProperty({
    description: '활동 카테고리 id',
  })
  activityCategoryId: number;

  @ApiProperty({
    description: '점수',
  })
  rank: number;

  @ApiProperty({
    description: '휴대폰 인증 여부',
  })
  phone: string;

  @ApiProperty({
    description: '정보 제공자',
  })
  @Exclude()
  provider: string;

  @Exclude()
  status: UserStatus;

  @ApiProperty({
    description: '생성 일자',
    format: 'timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정 일자',
    format: 'timestamp',
  })
  updatedAt: Date;

  @Exclude()
  deletedAt: Date | null;

  constructor(userInfo: Partial<UserInfoDto> = {}) {
    Object.assign(this, userInfo);
  }
}
