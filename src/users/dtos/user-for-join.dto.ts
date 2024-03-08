import { ApiProperty } from '@nestjs/swagger';
import { User } from '@src/entities/User';
import { ResponseUserImageDto } from '@src/users/dtos/response-user-image.dto';

export class UserForJoinDto implements Pick<User, 'name'> {
  @ApiProperty({
    description: '유저 이름',
  })
  name: string;

  @ApiProperty({
    description: 'user image response용 dto',
  })
  userImage: ResponseUserImageDto;
}
