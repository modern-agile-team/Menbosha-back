import { ApiProperty, PickType } from '@nestjs/swagger';
import { HelpYouCommentDto } from './help-you-comment.dto';
import { UserForJoinDto } from 'src/users/dtos/user-for-join.dto';
import { User } from 'src/users/entities/user.entity';
import { UserIntro } from 'src/users/entities/user-intro.entity';

class HelpYouCommentUserIntroDto
  implements Pick<UserIntro, 'shortIntro' | 'career'>
{
  @ApiProperty({
    description: '멘토 짧은 소개',
  })
  shortIntro: string;

  @ApiProperty({
    description: '멘토 커리어',
  })
  career: string;
}

class HelpYouCommentUserDto
  extends UserForJoinDto
  implements Pick<User, 'rank' | 'activityCategoryId'>
{
  @ApiProperty({
    description: '점수',
    format: 'integer',
  })
  rank: number;

  @ApiProperty({
    description: '활동 카테고리 고유 ID',
    format: 'integer',
    minimum: 1,
  })
  activityCategoryId: number;

  @ApiProperty({
    description: '유저 소개',
  })
  userIntro: HelpYouCommentUserIntroDto;
}

export class HelpYouCommentWithUserAndUserImageDto extends PickType(
  HelpYouCommentDto,
  ['id', 'userId', 'helpMeBoardId', 'createdAt'],
) {
  @ApiProperty({
    description: '도와주세요 댓글 유저 정보 객체',
    type: HelpYouCommentUserDto,
  })
  user: HelpYouCommentUserDto;

  constructor(
    helpYouCommentWithUserAndUserImageDto: HelpYouCommentWithUserAndUserImageDto,
  ) {
    super();

    Object.assign(this, helpYouCommentWithUserAndUserImageDto);
  }
}