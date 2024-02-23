import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BannedUserRepository } from 'src/admins/banned-user/repositories/banned-user.repository';
import { CreateBannedUserBodyDto } from 'src/admins/banned-user/dtos/create-banned-user-body.dto';
import { UserService } from 'src/users/services/user.service';
import { DataSource } from 'typeorm';
import { BannedUserDto } from 'src/admins/banned-user/dtos/banned-user.dto';
import { UserStatus } from 'src/users/constants/user-status.enum';

@Injectable()
export class BannedUsersService {
  constructor(
    private readonly bannedUserRepository: BannedUserRepository,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  async createBannedUser(
    adminId: number,
    userId: number,
    createBannedUserBodyDto: CreateBannedUserBodyDto,
  ): Promise<BannedUserDto> {
    if (new Date(createBannedUserBodyDto.endAt) < new Date()) {
      throw new BadRequestException(
        'endAt must be a future time compared to the current time.',
      );
    }

    const existTargetUser = await this.userService.findOneByOrNotFound({
      select: ['id', 'admin'],
      where: { id: userId, status: UserStatus.ACTIVE },
    });

    if (existTargetUser.admin) {
      throw new ForbiddenException('Admin cannot be banned.');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      console.log(entityManager);

      const bannedUser = await this.bannedUserRepository.createBannedUser(
        entityManager,
        adminId,
        userId,
        createBannedUserBodyDto,
      );

      await queryRunner.commitTransaction();

      return new BannedUserDto(bannedUser);
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();

        console.error(error);

        throw new InternalServerErrorException(
          'Error occurred while banning the user.',
        );
      }
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }
}
