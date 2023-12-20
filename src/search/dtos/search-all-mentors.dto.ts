import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { UserIntro } from 'src/users/entities/user-intro.entity';
import { UserImage } from 'src/users/entities/user-image.entity';

export class SearchAllMentorsDto
  implements Pick<User, 'id' | 'name' | 'userImage' | 'userIntro'>
{
  @ApiProperty({
    description: '멘토 유저 고유 id',
  })
  id: number;

  @ApiProperty({
    description: '멘토 유저 이름',
  })
  name: string;

  @ApiProperty({
    description: '멘토 유저 이미지',
  })
  userImage: UserImage;

  @ApiProperty({
    description: '멘토 유저 소개',
  })
  userIntro: UserIntro;

  constructor(searchAllMentorsDto: Partial<SearchAllMentorsDto> = {}) {
    this.id = searchAllMentorsDto.id;
    this.name = searchAllMentorsDto.name;
    this.userImage = searchAllMentorsDto.userImage;
    this.userIntro = searchAllMentorsDto.userIntro;
  }
}
