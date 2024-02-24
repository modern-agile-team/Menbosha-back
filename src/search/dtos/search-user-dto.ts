import { ApiProperty } from '@nestjs/swagger';
import { UserImage } from '@src/users/entities/user-image.entity';
import { User } from '@src/users/entities/user.entity';

export class SearchUserDto implements Pick<User, 'id' | 'name'> {
  @ApiProperty({
    description: '작성자 고유 id',
    format: 'integer',
  })
  id: number;

  @ApiProperty({
    description: '작성자 이름',
  })
  name: string;

  @ApiProperty({
    description: '작성자 프로필 이미지 object',
    type: 'object',
    properties: {
      imageUrl: {
        description: '작성자 프로필 이미지 url',
        type: 'string',
      },
    },
  })
  userImage: Pick<UserImage, 'imageUrl'>;
}
