import { Exclude } from 'class-transformer';
import { UserInfoDto } from './user-info.dto';

export class MyProfileResponseDTO extends UserInfoDto {
  constructor(myProfileResponseDto: Partial<MyProfileResponseDTO> = {}) {
    super();
  }

  @Exclude()
  admin: boolean;

  @Exclude()
  rank: number;
}
