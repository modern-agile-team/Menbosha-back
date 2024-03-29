import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PutUpdateUserForAdminDto } from '@src/admins/dtos/put-update-user-for-admin.dto';
import { UserResponseForAdminDto } from '@src/admins/dtos/user-response-for-admin.dto';
import { ADMIN_ERROR_CODE } from '@src/constants/error/admin/admin-error-code.constant';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { UserRole } from '@src/users/constants/user-role.enum';
import { UserService } from '@src/users/services/user.service';

@Injectable()
export class AdminsService {
  constructor(private readonly userService: UserService) {}

  async putUpdateUserStatus(
    adminId: number,
    userId: number,
    putUpdateUserForAdminDto: PutUpdateUserForAdminDto,
  ): Promise<UserResponseForAdminDto> {
    const existUser = await this.userService.findOneByOrNotFound({
      where: { id: userId },
    });

    if (adminId !== userId && existUser.role === UserRole.ADMIN) {
      throw new HttpForbiddenException({
        code: ADMIN_ERROR_CODE.DENIED_FOR_ADMINS,
      });
    }

    const updateResult = await this.userService.updateUser(userId, {
      ...putUpdateUserForAdminDto,
    });

    if (!updateResult.affected) {
      throw new InternalServerErrorException('유저 업데이트 중 서버 에러 발생');
    }

    return new UserResponseForAdminDto({
      ...existUser,
      ...putUpdateUserForAdminDto,
    });
  }
}
