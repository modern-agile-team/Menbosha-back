import { ApiProperty } from '@nestjs/swagger';
import { BannedUsersItemDto } from '@src/admins/banned-user/dtos/banned-users-item.dto';
import { PaginationResponseDto } from '@src/common/dto/pagination-response.dto';

export class BannedUsersPaginationResponseDto extends PaginationResponseDto {
  @ApiProperty({
    description: '밴 당한 유저 item',
    type: [BannedUsersItemDto],
  })
  bannedUsersItemDto: BannedUsersItemDto[];

  constructor(
    bannedUsersItemDto: BannedUsersItemDto[],
    totalCount: number,
    page: number,
    pageSize: number,
  ) {
    super(totalCount, page, pageSize);

    this.bannedUsersItemDto = bannedUsersItemDto;
  }
}
