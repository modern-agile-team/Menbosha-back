import { Injectable } from '@nestjs/common';
import { BannedUserRepository } from 'src/admins/banned-user/repositories/banned-user.repository';
import { CreateBannedUserBodyDto } from 'src/admins/dtos/create-banned-user-body.dto';

@Injectable()
export class BannedUsersService {
  constructor(private readonly bannedUserRepository: BannedUserRepository) {}
  createBannedUser(
    myId: number,
    userId: number,
    createBannedUserBodyDto: CreateBannedUserBodyDto,
  ) {
    console.log(createBannedUserBodyDto);
  }
}
