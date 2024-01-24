import { ExecutionContext, Injectable } from '@nestjs/common';
import { TokenService } from 'src/auth/services/token.service';

@Injectable()
export class JwtRefreshTokenGuard {
  constructor(private tokenService: TokenService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];
    if (!authorization) {
      return false;
    }

    const [type, refreshToken] = authorization.split(' ');
    if (type !== 'Bearer') {
      return false;
    }

    const userId = await this.tokenService.decodeToken(refreshToken);
    request.user = { userId };

    return true;
  }
}
