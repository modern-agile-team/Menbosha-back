import { ApiProperty, PickType } from '@nestjs/swagger';
import { HelpYouCommentDto } from './help-you-comment.dto';
import { UserForJoinDto } from 'src/users/dtos/user-for-join.dto';

export class HelpYouCommentWithUserAndUserImageDto extends PickType(
  HelpYouCommentDto,
  ['id', 'userId', 'helpMeBoardId', 'createdAt'],
) {
  @ApiProperty({
    description: '도와주세요 댓글 유저 정보 객체',
    type: UserForJoinDto,
  })
  user: UserForJoinDto;
}
