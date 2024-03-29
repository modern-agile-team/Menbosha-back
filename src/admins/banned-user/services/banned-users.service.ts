import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BannedUserRepository } from '@src/admins/banned-user/repositories/banned-user.repository';
import { CreateBannedUserBodyDto } from '@src/admins/banned-user/dtos/create-banned-user-body.dto';
import { UserService } from '@src/users/services/user.service';
import { DataSource } from 'typeorm';
import { BannedUserDto } from '@src/admins/banned-user/dtos/banned-user.dto';
import { UserStatus } from '@src/users/constants/user-status.enum';
import { ADMIN_ERROR_CODE } from '@src/constants/error/admin/admin-error-code.constant';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { UserRole } from '@src/users/constants/user-role.enum';
import { BannedUserPageQueryDto } from '@src/admins/banned-user/dtos/banned-user-page-query.dto';
import { QueryHelper } from '@src/helpers/query.helper';
import { plainToInstance } from 'class-transformer';
import { BannedUsersItemDto } from '@src/admins/banned-user/dtos/banned-users-item.dto';
import { BannedUsersPaginationResponseDto } from '@src/admins/banned-user/dtos/banned-users-pagination-response.dto';
import { SortOrder } from '@src/common/constants/sort-order.enum';
import { BannedUser } from '@src/entities/BannedUser';

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

    const existTargetUser =
      await this.userService.findOneByQueryBuilderOrNotFound(userId);

    if (existTargetUser.role === UserRole.ADMIN) {
      throw new HttpForbiddenException({
        code: ADMIN_ERROR_CODE.DENIED_FOR_ADMINS,
      });
    }

    if (
      existTargetUser.banned[0]?.endAt > new Date() &&
      existTargetUser.status === UserStatus.INACTIVE
    ) {
      throw new ConflictException('user has already been banned.');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const bannedUser = await this.bannedUserRepository.create(
        entityManager,
        adminId,
        existTargetUser.id,
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

  async findOneOrNotFound(id: number): Promise<BannedUserDto> {
    const existBannedUser = await this.bannedUserRepository.findOne({
      where: { id },
    });

    if (!existBannedUser) {
      throw new NotFoundException('해당 밴 정보를 찾지 못했습니다');
    }

    return new BannedUserDto(existBannedUser);
  }

  async findOneByUserId(userId: number): Promise<BannedUserDto> {
    const existBannedUser = await this.bannedUserRepository.findOne({
      where: { bannedUserId: userId },
      order: { bannedAt: SortOrder.DESC },
    });

    return existBannedUser ? new BannedUserDto(existBannedUser) : null;
  }
}
