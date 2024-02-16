import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { request } from 'express';

@Injectable()
export class JwtOptionalGuard extends AuthGuard('accessToken') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(
    err: any,
    user: any,
    info: { message: string | Record<string, any> },
    context: ExecutionContext,
  ): any {
    if (user) {
      request.user = { id: user.userId };
      return request.user;
    }
    return null;
  }
}
