import { ExecutionContext, Injectable } from '@nestjs/common';
import { TokenService } from 'src/auth/services/token.service';

@Injectable()
export class JwtOptionalGuard {
  constructor(private tokenService: TokenService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];
    if (!authorization) {
      const userId = null;
      request.user = { userId };
      return true;
    }

    const [type, accessToken] = authorization.split(' ');
    if (type !== 'Bearer') {
      const userId = null;
      request.user = { userId };
      return true;
    }

    const userId = await this.tokenService.decodeToken(accessToken);
    request.user = { userId };

    return true;
  }
}
