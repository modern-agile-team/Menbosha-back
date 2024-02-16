import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { request } from 'express';
import { Observable } from 'rxjs';

function AuthGuardMixin(strategy: string) {
  abstract class MixinAuthGuard extends AuthGuard(strategy) {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const request = context.switchToHttp().getRequest();
      const authorization = request.headers['authorization'];
      if (!authorization) {
        throw new HttpException('jwt must be provided', HttpStatus.BAD_REQUEST);
      }
      return super.canActivate(context);
    }

    handleRequest(
      err: any,
      user: any,
      info: { message: string | Record<string, any> },
      context: ExecutionContext,
    ) {
      try {
        if (user) {
          return super.handleRequest(err, user, info, context);
        } else {
          if (err instanceof HttpException) throw err;
          else {
            throw new HttpException(info.message, this.getStatus(info.message));
          }
        }
      } catch (error) {
        if (error instanceof HttpException) throw error;
        else {
          console.log(error.message);
          throw new HttpException('jwt error', HttpStatus.BAD_REQUEST);
        }
      }
    }

    getStatus(message: string | Record<string, any>): HttpStatus {
      switch (message) {
        case 'jwt expired':
        case 'invalid signature':
          return HttpStatus.UNAUTHORIZED;
        case 'jwt must be provided':
        case 'jwt malformed':
        case 'invalid token':
          return HttpStatus.BAD_REQUEST;
        default:
          return HttpStatus.BAD_REQUEST;
      }
    }
  }

  return MixinAuthGuard;
}

@Injectable()
export class AccessTokenAuthGuard extends AuthGuardMixin('accessToken') {}

@Injectable()
export class RefreshTokenAuthGuard extends AuthGuardMixin('refreshToken') {}

@Injectable()
export class AccessTokenOptionalAuthGuard extends AuthGuard('accessToken') {
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
