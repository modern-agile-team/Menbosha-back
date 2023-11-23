// import { ExecutionContext, Injectable } from '@nestjs/common';
// import { TokenService } from 'src/auth/services/token.service';

// @Injectable()
// export class WebSocketJwtAccessTokenGuard {
//   constructor(private tokenService: TokenService) {}

//   async canActivate(context: ExecutionContext) {
//     const request = context.switchToWs().getClient().handshake;
//     const accessToken = request.headers['access_token'];

//     if (!accessToken) {
//       return false;
//     }

//     const userId = await this.tokenService.decodeToken(accessToken);
//     request.user = { userId };
//     console.log(request.user);

//     return true;
//   }
// }

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return true;
  }
}
