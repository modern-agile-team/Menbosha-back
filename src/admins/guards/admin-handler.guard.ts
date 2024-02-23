import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ONLY_ADMIN_TOKEN } from 'src/admins/constants/only-admin.token';
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

    return user.admin === this.getMetadata(context);
  }

  private getMetadata(context: ExecutionContext) {
    return this.reflector.get<boolean>(ONLY_ADMIN_TOKEN, context.getHandler());
  }
}
