import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisService } from '@src/common/redis/services/redis.service';
import { TokenPayload } from '@src/auth/interfaces/token-payload.interface';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'accessToken',
) {
  constructor(
    private readonly redisService: RedisService,
    private readonly appConfigService: AppConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.get<string>(
        ENV_KEY.JWT_ACCESS_TOKEN_SECRET_KEY,
      ),
      passReqToCallback: true,
    });
  }

  async validate(request: any, payload: TokenPayload) {
    if (payload.sub !== 'accessToken') {
      throw new HttpException('invalid token type', HttpStatus.BAD_REQUEST);
    }

    const tokenFromRequest = request.headers.authorization.split(' ')[1];
    const tokenInRedis = await this.redisService.getToken(
      `${payload.userId}-accessToken`,
    );

    if (!tokenInRedis) {
      throw new HttpException('token not found', HttpStatus.NOT_FOUND);
    } else if (tokenInRedis !== tokenFromRequest) {
      await this.redisService.delTokens([
        `${payload.userId}-accessToken`,
        `${payload.userId}-refreshToken`,
      ]);

      throw new HttpException('token mismatch', HttpStatus.UNAUTHORIZED);
    }

    return { id: payload.userId };
  }
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor(
    private readonly redisService: RedisService,
    private readonly appConfigService: AppConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.get<string>(
        ENV_KEY.JWT_REFRESH_TOKEN_SECRET_KEY,
      ),
      passReqToCallback: true,
    });
  }

  async validate(request: any, payload: TokenPayload) {
    if (payload.sub !== 'refreshToken') {
      throw new HttpException('invalid token type', HttpStatus.BAD_REQUEST);
    }

    const tokenFromRequest = request.headers.authorization.split(' ')[1];
    const tokenInRedis = await this.redisService.getToken(
      `${payload.userId}-refreshToken`,
    );

    if (!tokenInRedis) {
      throw new HttpException('token not found', HttpStatus.NOT_FOUND);
    } else if (tokenInRedis !== tokenFromRequest) {
      await this.redisService.delTokens([
        `${payload.userId}-accessToken`,
        `${payload.userId}-refreshToken`,
      ]);

      throw new HttpException('token mismatch', HttpStatus.UNAUTHORIZED);
    }

    return { id: payload.userId };
  }
}
