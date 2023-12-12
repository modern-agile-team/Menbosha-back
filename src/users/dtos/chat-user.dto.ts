import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class ChatUserDto implements Pick<User, 'name'> {
  @ApiProperty({
    description: '유저 고유 id',
    format: 'integer',
  })
  userId: number;

  @ApiProperty({
    description: '유저 이름',
  })
  name: string;

  @ApiProperty({
    description: '유저의 이미지',
  })
  userImage: string;

  constructor(chatUserDto: Partial<ChatUserDto> = {}) {
    this.userId = chatUserDto.userId;
    this.name = chatUserDto.name;
    this.userImage = chatUserDto.userImage;
  }
}
