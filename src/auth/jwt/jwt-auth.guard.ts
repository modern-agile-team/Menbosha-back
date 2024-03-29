import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class AccessTokenAuthGuard extends AuthGuard('accessToken') {
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
      }

      if (err instanceof HttpException) throw err;

      throw new HttpException(info.message, getStatus(info.message));
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else {
        console.log(error.message);
        throw new HttpException('jwt error', HttpStatus.BAD_REQUEST);
      }
    }
  }
}

@Injectable()
export class RefreshTokenAuthGuard extends AuthGuard('refreshToken') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.cookies['refreshToken'];
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
      }

      if (err instanceof HttpException) throw err;

      throw new HttpException(info.message, getStatus(info.message));
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else {
        console.log(error.message);
        throw new HttpException('jwt error', HttpStatus.BAD_REQUEST);
      }
    }
  }
}

@Injectable()
export class AccessTokenOptionalAuthGuard extends AuthGuard('accessToken') {
  handleRequest(
    err: any,
    user: any,
    info: { message: string | Record<string, any> },
    context: ExecutionContext,
  ): any {
    return user;
  }
}

function getStatus(message: string | Record<string, any>): HttpStatus {
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
