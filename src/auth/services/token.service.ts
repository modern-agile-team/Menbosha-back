import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@src/common/redis/services/redis.service';
import { Ttl } from '@src/common/redis/constants/ttl.enum';
import { TokenPayload } from '@src/auth/interfaces/token-payload.interface';
import { TokenRepository } from '@src/auth/repositories/token.repository';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';

@Injectable()
export class TokenService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async getUserTokens(userId: number) {
    const getUserTokens = await this.tokenRepository.getUserToken(userId);
    if (!getUserTokens) {
      throw new HttpException('토큰을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }
    return getUserTokens;
  }

  async saveTokens(
    userId: number,
    accessToken: string,
    refreshToken: string,
    socialAccessToken: string,
    socialRefreshToken: string,
  ) {
    await this.redisService.setToken(
      String(userId) + '-accessToken',
      accessToken,
      Ttl.accessToken,
    );
    await this.redisService.setToken(
      String(userId) + '-refreshToken',
      refreshToken,
      Ttl.refreshToken,
    );

    const tokens = await this.tokenRepository.getUserToken(userId);

    if (tokens) {
      return await this.tokenRepository.updateTokens(
        userId,
        refreshToken,
        socialAccessToken,
        socialRefreshToken,
      );
    }
    return await this.tokenRepository.saveTokens(
      userId,
      refreshToken,
      socialAccessToken,
      socialRefreshToken,
    );
  }

  async checkValidKakaoToken(accessToken: string) {
    try {
      const kakaoUnlinkUrl = 'https://kapi.kakao.com/v1/user/access_token_info';
      const kakaoUnlinkHeader = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      return (await axios.get(kakaoUnlinkUrl, kakaoUnlinkHeader)).status;
    } catch (error) {
      console.error('카카오 토큰 유효성 검사 오류:', error);
      throw new HttpException(
        '카카오 토큰 유효성 검사 오류',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async getNewKakaoToken(refreshToken: string) {
    try {
      const kakaoTokenUrl = 'https://kauth.kakao.com/oauth/token';
      const kakaoTokenHeader = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      };
      const kakaoTokenData = {
        grant_type: 'refresh_token',
        client_id: this.appConfigService.get<string>(ENV_KEY.KAKAO_CLIENT_ID),
        refresh_token: refreshToken,
      };

      return (await axios.post(kakaoTokenUrl, kakaoTokenData, kakaoTokenHeader))
        .data;
    } catch (error) {
      console.error('카카오 토큰 갱신 오류:', error);
      return false;
    }
  }

  async checkValidNaverToken(accessToken: string) {
    try {
      const naverUnlinkUrl = 'https://openapi.naver.com/v1/nid/me';
      const naverUnlinkHeader = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      return (await axios.get(naverUnlinkUrl, naverUnlinkHeader)).status;
    } catch (error) {}
  }

  async getNewNaverToken(refreshToken: string) {
    try {
      const naverTokenUrl = 'https://nid.naver.com/oauth2.0/token';
      const naverTokenData = {
        grant_type: 'refresh_token',
        client_id: this.appConfigService.get<string>(ENV_KEY.NAVER_CLIENT_ID),
        client_secret: this.appConfigService.get<string>(
          ENV_KEY.NAVER_CLIENT_SECRET,
        ),
        refresh_token: refreshToken,
      };

      return (await axios.post(naverTokenUrl, naverTokenData)).data;
    } catch (error) {
      console.error('네이버 토큰 갱신 오류:', error);
      return false;
    }
  }

  async deleteTokens(userId: number) {
    try {
      await this.redisService.delTokens([
        `${userId}-accessToken`,
        `${userId}-refreshToken`,
      ]);
      await this.tokenRepository.deleteTokens(userId);

      return { message: '토큰 삭제 성공' };
    } catch (error) {
      throw new HttpException('토큰을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }
  }

  generateAccessToken(userId: number) {
    const payload: TokenPayload = {
      sub: 'accessToken',
      userId,
    };

    return this.jwtService.sign(payload, {
      expiresIn: '6h',
      secret: this.appConfigService.get<string>(
        ENV_KEY.JWT_ACCESS_TOKEN_SECRET_KEY,
      ),
    });
  }

  async generateNewAccessToken(userId: number) {
    const newAccessToken = this.generateAccessToken(userId);
    await this.redisService.setToken(
      String(userId) + '-accessToken',
      newAccessToken,
      Ttl.accessToken,
    );

    return { accessToken: newAccessToken };
  }

  generateRefreshToken(userId: number) {
    const payload: TokenPayload = {
      sub: 'refreshToken',
      userId,
    };

    return this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.appConfigService.get<string>(
        ENV_KEY.JWT_REFRESH_TOKEN_SECRET_KEY,
      ),
    });
  }
}
