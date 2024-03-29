import { ApiProperty } from '@nestjs/swagger';
import { User } from '@src/entities/User';
import { UserImage } from '@src/entities/UserImage';
import { USER_NAME_LENGTH } from '@src/users/constants/user.constant';

export class SearchUserDto implements Pick<User, 'id' | 'name'> {
  @ApiProperty({
    description: '작성자 고유 id',
    format: 'integer',
  })
  id: number;

  @ApiProperty({
    description: '작성자 이름',
    minLength: USER_NAME_LENGTH.MIN,
    maxLength: USER_NAME_LENGTH.MAX,
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
