import { ApiProperty, PickType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserForJoinDto } from '@src/users/dtos/user-for-join.dto';
import { UserIntroResponseDto } from '@src/mentors/dtos/user-intro-response.dto';
import { USER_NAME_LENGTH } from '@src/users/constants/user.constant';

export class UserWithImageAndIntroDto extends PickType(UserForJoinDto, [
  'userImage',
]) {
  @ApiProperty({
    minimum: 1,
    format: 'integer',
  })
  id: number;

  @ApiProperty({
    description: '유저 이름',
    minLength: USER_NAME_LENGTH.MIN,
    maxLength: USER_NAME_LENGTH.MAX,
  })
  name: string;

  @Exclude()
  user_rank: number;

  @ApiProperty({
    description: '유저 랭크',
    format: 'integer',
  })
  rank: number;

  @ApiProperty({
    description: '유저 인트로 객체',
  })
  userIntro: UserIntroResponseDto;

  @ApiProperty({
    description: '멘토 리뷰 후기 당한 개수',
    format: 'integer',
  })
  mentorReviewCount: number;

  @ApiProperty({
    description: '멘토 게시판 글쓴 갯수',
    format: 'integer',
  })
  mentorBoardCount: number;

  constructor(
    userWithImageAndIntroDto: Partial<UserWithImageAndIntroDto> = {},
  ) {
    super();

    Object.assign(this, userWithImageAndIntroDto);
    this.mentorReviewCount = Number(userWithImageAndIntroDto.mentorReviewCount);
    this.mentorBoardCount = Number(userWithImageAndIntroDto.mentorBoardCount);
    this.rank = userWithImageAndIntroDto.user_rank;
  }
}
