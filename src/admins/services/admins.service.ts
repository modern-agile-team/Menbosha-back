import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PutUpdateUserForAdminDto } from '@src/admins/dtos/put-update-user-for-admin.dto';
import { UserResponseForAdminDto } from '@src/admins/dtos/user-response-for-admin.dto';
import { ADMIN_ERROR_CODE } from '@src/constants/error/admin/admin-error-code.constant';
import { AdminException } from '@src/http-exceptions/exceptions/admin-exception';
import { UserRole } from '@src/users/constants/user-role.enum';
import { UserService } from '@src/users/services/user.service';

@Injectable()
export class AdminsService {
  constructor(private readonly userService: UserService) {}

  async putUpdateUserStatus(
    adminId: number,
    userId: number,
    putUpdateUserForAdminDto: PutUpdateUserForAdminDto,
  ) {
    const existUser = await this.userService.findOneByOrNotFound({
      where: { id: userId },
    });

    if (adminId !== userId && existUser.role === UserRole.ADMIN) {
      throw new AdminException({ code: ADMIN_ERROR_CODE.DENIED_FOR_ADMINS });
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
