import { ApiProperty } from '@nestjs/swagger';
import { UserImage } from '@src/entities/UserImage';

export class ResponseUserImageDto implements Pick<UserImage, 'imageUrl'> {
  @ApiProperty({
    description: '이미지의 url',
  })
  imageUrl: string;
}
