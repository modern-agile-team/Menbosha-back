import { ApiProperty, PickType } from '@nestjs/swagger';
import { MentorBoardDto } from './mentor-board.dto';
import { User } from 'src/users/entities/user.entity';
import { UserImage } from 'src/users/entities/user-image.entity';
import { MentorBoardImage } from 'src/boards/entities/mentor-board-image.entity';

class MentorBoardHotPostUserImageDto implements Pick<UserImage, 'imageUrl'> {
  @ApiProperty({
    description: '이미지의 url',
  })
  imageUrl: string;
}

class MentorBoardHotPostUserDto implements Pick<User, 'name'> {
  @ApiProperty({
    description: '유저 이름',
  })
  name: string;
  
  @ApiProperty({
    description: 'userImage 객체',
  })
  userImage: MentorBoardHotPostUserImageDto;
}

class MentorBoardHotPostImagesItem
  implements Pick<MentorBoardImage, 'id' | 'imageUrl'>
{
  @ApiProperty({
    description: 'mentorBoardImage 고유 ID',
  })
  id: number;

  @ApiProperty({
    description: 'mentorBoard 이미지 url',
  })
  imageUrl: string;
}

export class MentorBoardForHotPostDto extends PickType(MentorBoardDto, [
  'id',
  'userId',
  'head',
  'body',
  'categoryId',
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty({
    description: '멘토 게시판 인기 게시글 유저 정보 객체',
    type: MentorBoardHotPostUserDto,
  })
  user: MentorBoardHotPostUserDto;

  @ApiProperty({
    description: '멘토 게시판 인기 게시글 이미지 객체',
    isArray: true,
    type: MentorBoardHotPostImagesItem,
  })
  mentorBoardImages: MentorBoardHotPostImagesItem[];

  constructor(mentorBoardForHotPostDto: MentorBoardForHotPostDto) {
    super();
    Object.assign(this, mentorBoardForHotPostDto);
  }
}
