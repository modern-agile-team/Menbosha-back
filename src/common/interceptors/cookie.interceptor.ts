import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class CookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data) => {
        const res = context.switchToHttp().getResponse();
        res.cookie('refresh_token', data.refreshToken, {
          httpOnly: true,
          sameSite: 'Lax',
          domain: 'localhost',
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
        });
      }),
    );
  }
}
