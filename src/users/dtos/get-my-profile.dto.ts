import { UserRole } from '@src/users/constants/user-role.enum';
import { UserInfoDto } from '@src/users/dtos/user-info.dto';
import { Exclude } from 'class-transformer';

export class MyProfileResponseDTO extends UserInfoDto {
  constructor(myProfileResponseDto: Partial<MyProfileResponseDTO> = {}) {
    super();
  }

  @Exclude()
  role: UserRole;
}
