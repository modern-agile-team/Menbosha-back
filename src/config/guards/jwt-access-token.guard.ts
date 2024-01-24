import { ExecutionContext, Injectable } from '@nestjs/common';
import { TokenService } from 'src/auth/services/token.service';

@Injectable()
export class JwtAccessTokenGuard {
  constructor(private tokenService: TokenService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];

    const [type, accessToken] = authorization.split(' ');
    if (type !== 'Bearer') {
      return false;
    }

    const userId = await this.tokenService.decodeToken(accessToken);
    request.user = { userId };

    return true;
  }
}
