import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { ResponseUserImageDto } from './response-user-image.dto';

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
