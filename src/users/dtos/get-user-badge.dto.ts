import { UserBadgeDto } from '@src/users/dtos/user-badge.dto';

export class UserBadgeResponseDTO extends UserBadgeDto {
  constructor(userBadgeResponseDTO: Partial<UserBadgeResponseDTO> = {}) {
    super();
  }
}
