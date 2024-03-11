import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@src/users/constants/user-status.enum';
import { UserProvider } from '@src/auth/enums/user-provider.enum';
import { UserRole } from '@src/users/constants/user-role.enum';
import { User } from '@src/entities/User';
import {
  USER_EMAIL_LENGTH,
  USER_NAME_LENGTH,
} from '@src/users/constants/user.constant';

export class UserInfoDto
  implements
    Omit<
      User,
      | 'userImage'
      | 'userIntro'
      | 'mentorBoards'
      | 'helpMeBoards'
      | 'helpYouComments'
      | 'userBadges'
      | 'token'
      | 'activityCategory'
      | 'hopeCategory'
      | 'totalCount'
      | 'mentorBoardLikes'
      | 'userRanking'
      | 'mentorReviewChecklistCount'
      | 'reports'
      | 'banned'
      | 'bans'
      | 'reported'
      | 'uniqueId'
      | 'reviewed'
      | 'reviews'
    >
{
  @ApiProperty({
    description: '유저 아이디',
    format: 'integer',
    minLength: 1,
  })
  id: number;

  @ApiProperty({
    description: '유저 이름',
    minLength: USER_NAME_LENGTH.MIN,
    maxLength: USER_NAME_LENGTH.MAX,
  })
  name: string;

  @ApiProperty({
    description: '유저 이메일',
    format: 'email',
    minLength: USER_EMAIL_LENGTH.MIN,
    maxLength: USER_EMAIL_LENGTH.MAX,
  })
  email: string;

  @ApiProperty({
    description: '유저 역할',
    enum: UserRole,
  })
  role: UserRole;

  @ApiProperty({
    description: '멘토 여부',
  })
  isMentor: boolean;

  @ApiProperty({
    description: '희망 카테고리 id',
    format: 'integer',
    minimum: 1,
  })
  hopeCategoryId: number;

  @ApiProperty({
    description: '활동 카테고리 id',
    format: 'integer',
    minimum: 1,
  })
  activityCategoryId: number;

  @ApiProperty({
    description: '등급',
    format: 'integer',
    minimum: 1,
  })
  rank: number;

  @ApiProperty({
    description: '휴대폰 인증 여부',
    nullable: true,
    type: () => String,
  })
  phone: string | null;

  @ApiProperty({
    description: '정보 제공자',
  })
  @Exclude()
  provider: UserProvider;

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
