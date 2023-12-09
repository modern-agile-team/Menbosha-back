import { ApiProperty } from '@nestjs/swagger';
import { UserImage } from '../entities/user-image.entity';
import { User } from '../entities/user.entity';

export class ChatUserDto implements Pick<User, 'id' | 'name' | 'userImage'> {
  @ApiProperty({
    description: '유저 고유 id',
    format: 'integer',
  })
  id: number;

  @ApiProperty({
    description: '유저 이름',
  })
  name: string;

  @ApiProperty({
    description: '유저의 이미지',
  })
  userImage: UserImage;

  constructor(chatUserDto: ChatUserDto) {
    Object.assign(this, chatUserDto);
  }
}
