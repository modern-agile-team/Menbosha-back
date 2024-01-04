import { UserBadgeDto } from './user-badge.dto';

export class UserBadgeResponseDTO extends UserBadgeDto {
  constructor(userBadgeResponseDTO: Partial<UserBadgeResponseDTO> = {}) {
    super();
  }
}
