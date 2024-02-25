import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BannedUserRepository } from '@src/admins/banned-user/repositories/banned-user.repository';
import { CreateBannedUserBodyDto } from '@src/admins/dtos/create-banned-user-body.dto';
import { UserService } from '@src/users/services/user.service';
import { DataSource } from 'typeorm';
import { BannedUserDto } from '@src/admins/banned-user/dtos/banned-user.dto';
import { UserStatus } from '@src/users/constants/user-status.enum';
import { ADMIN_ERROR_CODE } from '@src/constants/error/admin/admin-error-code.constant';
import { AdminException } from '@src/http-exceptions/exceptions/admin-exception';
import { UserRole } from '@src/users/constants/user-role.enum';
import { BannedUserPageQueryDto } from '@src/admins/dtos/banned-user-page-query.dto';
import { BannedUser } from '@src/admins/banned-user/entities/banned-user.entity';
import { QueryHelper } from '@src/helpers/query.helper';
import { plainToInstance } from 'class-transformer';
import { BannedUsersItemDto } from '@src/admins/banned-user/dtos/banned-users-item.dto';
import { BannedUsersPaginationResponseDto } from '@src/admins/banned-user/dtos/banned-users-pagination-response.dto';

@Injectable()
export class BannedUsersService {
  private readonly LIKE_SEARCH_FIELD: readonly (keyof Pick<
    BannedUser,
    'reason'
  >)[] = ['reason'];

  constructor(
    private readonly bannedUserRepository: BannedUserRepository,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
    private readonly queryHelper: QueryHelper,
  ) {}

  async create(
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
      select: ['id', 'role'],
      where: { id: userId, status: UserStatus.ACTIVE },
    });

    if (existTargetUser.role === UserRole.ADMIN) {
      throw new AdminException({ code: ADMIN_ERROR_CODE.DENIED_FOR_ADMINS });
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const bannedUser = await this.bannedUserRepository.create(
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

  async findAll(
    bannedUserPageQueyDto: BannedUserPageQueryDto,
  ): Promise<BannedUsersPaginationResponseDto> {
    const { page, pageSize, orderField, sortOrder, ...filter } =
      bannedUserPageQueyDto;

    const skip = (page - 1) * pageSize;

    const where = this.queryHelper.buildWherePropForFind(
      filter,
      this.LIKE_SEARCH_FIELD,
    );

    const order = this.queryHelper.buildOrderByPropForFind(
      orderField,
      sortOrder,
    );

    const [bannedUsers, totalCount] =
      await this.bannedUserRepository.findAllAndCount(
        skip,
        pageSize,
        where,
        order,
      );

    const bannedUsersItemDto = plainToInstance(BannedUsersItemDto, bannedUsers);

    return new BannedUsersPaginationResponseDto(
      bannedUsersItemDto,
      totalCount,
      page,
      pageSize,
    );
  }
}
