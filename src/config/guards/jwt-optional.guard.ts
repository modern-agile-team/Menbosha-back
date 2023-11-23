import { ExecutionContext, Injectable } from '@nestjs/common';
import { TokenService } from 'src/auth/services/token.service';

@Injectable()
export class JwtOptionalGuard {
  constructor(private tokenService: TokenService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers['access_token'];
    if (!accessToken) {
      const userId = undefined;
      request.user = { userId };
      return true;
    }

    const userId = await this.tokenService.decodeToken(accessToken);

    request.user = { userId };

    return true;
  }
}
