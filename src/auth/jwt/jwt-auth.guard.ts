import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('accessToken') {
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
    if (user) {
      return super.handleRequest(err, user, info, context);
    } else if (
      info.message === 'jwt expired' ||
      info.message === 'invalid signature'
    ) {
      throw new HttpException(info.message, HttpStatus.UNAUTHORIZED);
    } else if (
      info.message === 'jwt must be provided' ||
      info.message === 'jwt malformed' ||
      info.message === 'invalid token'
    ) {
      throw new HttpException(info.message, HttpStatus.BAD_REQUEST);
    } else {
      console.log(info.message);
      throw new HttpException('jwt error', HttpStatus.BAD_REQUEST);
    }
  }
}
