import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Provider } from '@src/auth/enums/provider.enum';
import { UserStatus } from '@src/users/constants/user-status.enum';
import { UserInfoDto } from '@src/users/dtos/user-info.dto';

export class UserResponseForAdminDto extends OmitType(UserInfoDto, [
  'email',
  'provider',
  'status',
  'deletedAt',
]) {
  @ApiProperty({
    description: '유저 이메일',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: '유저 정보 제공자',
    enum: Provider,
  })
  provider: Provider;

  @ApiProperty({
    description: '유저 상태',
    enum: UserStatus,
  })
  status: UserStatus;

  @ApiProperty({
    description: '유저 삭제 날짜',
    nullable: true,
    type: () => String,
    format: 'timestamp',
  })
  deletedAt: Date | null;

  constructor(userResponseForAdminDto: UserResponseForAdminDto) {
    super();

    Object.assign(this, userResponseForAdminDto);
  }
}
