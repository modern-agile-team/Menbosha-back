import { ApiProperty } from '@nestjs/swagger';
import { User } from '@src/users/entities/user.entity';

export class ChatUserDto implements Pick<User, 'name'> {
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
  userImage: string;

  constructor(chatUserDto: Partial<ChatUserDto> = {}) {
    this.id = chatUserDto.id;
    this.name = chatUserDto.name;
    this.userImage = chatUserDto.userImage;
  }
}
