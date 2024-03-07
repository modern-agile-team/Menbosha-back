import { ApiProperty } from '@nestjs/swagger';
import { UserImage } from '@src/users/entities/user-image.entity';

export class ResponseUserImageDto implements Pick<UserImage, 'imageUrl'> {
  @ApiProperty({
    description: '이미지의 url',
  })
  imageUrl: string;
}
