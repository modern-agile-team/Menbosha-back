import { ApiProperty, PickType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserForJoinDto } from '@src/users/dtos/user-for-join.dto';
import { UserIntroResponseDto } from './user-intro-response.dto';

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
  })
  name: string;

  @Exclude()
  user_rank: number;

  @ApiProperty({
    description: '유저 랭크',
  })
  rank: number;

  @ApiProperty({
    description: '유저 인트로 객체',
  })
  userIntro: UserIntroResponseDto;

  @ApiProperty({
    description: '멘토 리뷰 후기 당한 개수',
  })
  mentorReviewCount: number;

  @ApiProperty({
    description: '멘토 게시판 글쓴 갯수',
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
