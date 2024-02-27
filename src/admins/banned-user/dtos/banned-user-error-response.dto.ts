import { OmitType } from '@nestjs/swagger';
import { BannedUserDto } from '@src/admins/banned-user/dtos/banned-user.dto';
import { Exclude } from 'class-transformer';

export class BannedUserErrorResponseDto extends OmitType(BannedUserDto, [
  'banUserId',
]) {
  @Exclude()
  banUserId: number;

  constructor(bannedUserErrorResponseDto: BannedUserErrorResponseDto) {
    super();

    this.id = bannedUserErrorResponseDto.id;
    this.bannedUserId = bannedUserErrorResponseDto.bannedUserId;
    this.reason = bannedUserErrorResponseDto.reason;
    this.bannedAt = bannedUserErrorResponseDto.bannedAt;
    this.endAt = bannedUserErrorResponseDto.endAt;
  }
}
