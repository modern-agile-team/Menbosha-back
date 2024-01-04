import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TokenRepository } from '../repositories/token.repository';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly redisService: RedisService,
  ) {}

  async getUserTokens(userId: number) {
    const getUserTokens = await this.tokenRepository.getUserTokens(userId);
    if (getUserTokens.length <= 0) {
      throw new HttpException('토큰을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }
    return getUserTokens[0];
  }

  async saveTokens(
    userId: number,
    refreshToken: string,
    socialAccessToken: string,
    socialRefreshToken: string,
  ) {
    const tokens = await this.tokenRepository.getUserTokens(userId);

    if (tokens.length > 0) {
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
        client_id: process.env.KAKAO_CLIENT_ID,
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
        client_id: process.env.NAVER_CLIENT_ID,
        client_secret: process.env.NAVER_CLIENT_SECRET,
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
      await this.tokenRepository.deleteTokens(userId);

      return { message: '토큰 삭제 성공' };
    } catch (error) {
      throw new HttpException('토큰을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }
  }

  async verifyToken(token: string) {
    try {
      const jwtSecretKey = process.env.JWT_SECRET_KEY;
      const userId = jwt.verify(token, jwtSecretKey)['userId'];
      const tokenType = jwt.verify(token, jwtSecretKey)['sub'];
      if (tokenType === 'refreshToken') {
        const rrt = await this.redisService.getToken(String(userId)); // RedisRefreshToken

        if (token !== rrt) {
          throw new HttpException(
            '토큰을 찾을 수 없습니다.',
            HttpStatus.NOT_FOUND,
          );
        }
      }
      return { message: '유효한 토큰입니다.' };
    } catch (error) {
      if (error.message == 'jwt expired') {
        throw new HttpException('만료된 토큰입니다.', HttpStatus.FORBIDDEN);
      } else if (
        error.message == 'invalid token' ||
        error.message == 'invalid signature'
      ) {
        throw new HttpException(
          '유효하지 않은 토큰입니다.',
          HttpStatus.UNAUTHORIZED,
        );
      } else if (error.message == 'jwt must be provided') {
        throw new HttpException(
          '토큰이 제공되지 않았습니다.',
          HttpStatus.LENGTH_REQUIRED,
        );
      } else {
        console.log(error);
        throw new HttpException(
          '토큰 검증에 실패했습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async decodeToken(token: string) {
    await this.verifyToken(token);
    const payload = jwt.decode(token);
    const userId = payload['userId'];
    return userId;
  }

  async createAccessToken(userId: number) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const payload = {
      sub: 'accessToken',
      userId,
      // exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1시간
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30일 (개발용)
    };

    const accessToken = jwt.sign(payload, jwtSecretKey);

    return accessToken;
  }

  async createRefreshToken(userId: number) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const payload = {
      sub: 'refreshToken',
      userId,
      // exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7일
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 * 3, // 90일 (개발용)
    };
    const refreshToken = jwt.sign(payload, jwtSecretKey);

    return refreshToken;
  }

  async newAccessToken(refreshToken: string) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const payload = jwt.verify(refreshToken, jwtSecretKey);

    const userId = payload['userId'];
    const newAccessToken = await this.createAccessToken(userId);
    return newAccessToken;
  }
}
