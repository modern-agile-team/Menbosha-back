import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisService } from 'src/common/redis/redis.service';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'accessToken',
) {
  constructor(private readonly redisService: RedisService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESSTOKEN_SECRET_KEY,
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
  constructor(private readonly redisService: RedisService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESHTOKEN_SECRET_KEY,
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
