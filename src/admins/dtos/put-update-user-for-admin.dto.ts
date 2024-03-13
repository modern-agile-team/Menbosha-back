import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserStatus } from '@src/users/constants/user-status.enum';
import { User } from '@src/entities/User';

export class PutUpdateUserForAdminDto implements Pick<User, 'status'> {
  @ApiProperty({
    description: '유저 상태',
    enum: UserStatus,
  })
  @IsEnum(UserStatus)
  status: UserStatus;
}
