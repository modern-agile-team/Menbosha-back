import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_TOKEN } from '@src/admins/constants/roles.token';
import { ADMIN_ERROR_CODE } from '@src/constants/error/admin/admin-error-code.constant';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { UserRole } from '@src/users/constants/user-role.enum';
import { UserService } from '@src/users/services/user.service';

@Injectable()
export class RoleHandlerGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { role } = await this.userService.findOneByOrNotFound({
      where: { id: request.user.id },
    });

    if (!this.getMetadata(context).includes(role)) {
      throw new HttpForbiddenException({
        code: ADMIN_ERROR_CODE.ADMIN_ONLY_ACCESS,
      });
    }

    return this.getMetadata(context).includes(role);
  }

  private getMetadata(context: ExecutionContext) {
    return this.reflector.get<UserRole[]>(ROLES_TOKEN, context.getHandler());
  }
}
