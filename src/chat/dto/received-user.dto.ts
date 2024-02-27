import { ApiProperty } from '@nestjs/swagger';
import { IsPositiveInt } from '@src/common/decorators/validators/is-positive-int.decorator';

export class ReceivedUserDto {
  @ApiProperty({
    example: '1',
    description: '요청을 받는 유저 아이디',
    minimum: 1,
  })
  @IsPositiveInt()
  receiverId: number;
}
