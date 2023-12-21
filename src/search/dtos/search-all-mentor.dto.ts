import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { UserImage } from 'src/users/entities/user-image.entity';
import { UserIntro } from 'src/users/entities/user-intro.entity';

export class SearchAllMentorDto
  implements Pick<User, 'id' | 'name' | 'isMentor'>
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
    description: '멘토 유저 이미지 object',
    type: 'object',
    properties: {
      imageUrl: {
        description: '멘토 유저 이미지 url',
        type: 'string',
      },
    },
  })
  userImage: Pick<UserImage, 'imageUrl'>;

  @ApiProperty({
    description: '멘토 유저 소개 object',
    type: 'object',
    properties: {
      mainField: {
        description: '대표 멘토링 분야',
        type: 'string',
      },
      introduce: {
        description: '멘토 소개',
        type: 'string',
      },
    },
  })
  userIntro: Pick<UserIntro, 'mainField' | 'introduce'>;

  @ApiProperty({
    description: '멘토 여부',
    default: true,
  })
  isMentor: boolean = true;

  constructor(searchAllMentorsDto: Partial<SearchAllMentorDto> = {}) {
    this.id = searchAllMentorsDto.id;
    this.name = searchAllMentorsDto.name;
    this.userImage = searchAllMentorsDto.userImage;
    this.userIntro = searchAllMentorsDto.userIntro;
    this.isMentor = searchAllMentorsDto.isMentor;
  }
}
