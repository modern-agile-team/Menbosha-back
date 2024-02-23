import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ONLY_ADMIN_TOKEN } from 'src/admins/constants/only-admin.token';
import { ADMIN_ERROR_CODE } from 'src/constants/error/admin/admin-error-code.constant';
import { AdminException } from 'src/http-exceptions/exceptions/admin-exception';
import { UserService } from 'src/users/services/user.service';

@Injectable()
export class AdminHandlerGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = await this.userService.findOneByOrNotFound({
      where: { id: request.user.id },
    });

    if (user.admin !== this.getMetadata(context)) {
      throw new AdminException({ code: ADMIN_ERROR_CODE.ADMIN_ONLY_ACCESS });
    }

    return user.admin === this.getMetadata(context);
  }

  private getMetadata(context: ExecutionContext) {
    return this.reflector.get<boolean>(ONLY_ADMIN_TOKEN, context.getHandler());
  }
}
