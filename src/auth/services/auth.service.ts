import { TokenService } from './token.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/repositories/user.repository';
import * as dotenv from 'dotenv';
import { UserImageRepository } from 'src/users/repositories/user-image.repository';
import axios from 'axios';
import { AuthServiceInterface } from '../interfaces/auth-service.interface';

dotenv.config();

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userImageRepository: UserImageRepository,
    private readonly tokenService: TokenService,
  ) {}

  async login(authorizeCode: string, provider: string) {
    try {
      let tokenUrl: string,
        tokenHeader: object,
        tokenBody: object,
        userInfoUrl: string,
        userInfoHeader: object;

      if (provider === 'naver') {
        // 네이버 로그인 인가코드 발급
        tokenUrl = 'https://nid.naver.com/oauth2.0/token';
        tokenHeader = {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        };
        tokenBody = {
          grant_type: 'authorization_code',
          client_id: process.env.NAVER_CLIENT_ID,
          client_secret: process.env.NAVER_CLIENT_SECRET,
          code: authorizeCode,
          state: 'test',
          redirect_uri: process.env.NAVER_CALLBACK_URL,
        };
      } else if (provider === 'kakao') {
        // 카카오 로그인 인가코드 발급
        tokenUrl = 'https://kauth.kakao.com/oauth/token';
        tokenHeader = {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        };
        tokenBody = {
          grant_type: 'authorization_code',
          client_id: process.env.KAKAO_CLIENT_ID,
          redirect_uri: process.env.KAKAO_CALLBACK_URL,
          code: authorizeCode,
        };
      }

      const token = (await axios.post(tokenUrl, tokenBody, tokenHeader)).data;
      const socialAccessToken = token.access_token;
      const socialRefreshToken = token.refresh_token;

      if (provider === 'naver') {
        // 네이버 로그인 사용자 정보 조회
        userInfoUrl = 'https://openapi.naver.com/v1/nid/me';
        userInfoHeader = {
          headers: {
            Authorization: `Bearer ${socialAccessToken}`,
          },
        };
      } else if (provider === 'kakao') {
        // 카카오 로그인 사용자 정보 조회
        userInfoUrl = 'https://kapi.kakao.com/v2/user/me';
        userInfoHeader = {
          headers: {
            Authorization: `Bearer ${socialAccessToken}`,
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        };
      }

      const SocialuserInfo = (await axios.get(userInfoUrl, userInfoHeader))
        .data;
      const nickname =
        provider === 'naver'
          ? SocialuserInfo.response.nickname // 네이버 닉네임
          : SocialuserInfo.properties.nickname; // 카카오 닉네임
      const email =
        provider === 'naver'
          ? SocialuserInfo.response.email // 네이버 이메일
          : SocialuserInfo.kakao_account.email; // 카카오 이메일
      const profileImage =
        provider === 'naver'
          ? SocialuserInfo.response.profile_image // 네이버 프로필 이미지
          : SocialuserInfo.properties.profile_image; // 카카오 프로필 이미지

      const userInfo = {
        provider,
        nickname,
        email,
      };

      const checkUser = await this.userRepository.findUser(email, provider);
      if (checkUser) {
        // 이미 존재하는 사용자인 경우
        const userId = checkUser.id;

        await this.userRepository.updateUserName(userId, nickname); // 이름 업데이트

        const userImage = (
          await this.userImageRepository.checkUserImage(userId)
        ).imageUrl; // DB 이미지
        const imageUrlParts = userImage.split('/');
        const dbImageProvider = imageUrlParts[imageUrlParts.length - 2]; // 이미지 제공자 이름

        if (dbImageProvider != 'ma6-main.s3.ap-northeast-2.amazonaws.com') {
          // S3에 업로드된 이미지가 아닌 경우
          await this.userImageRepository.updateUserImage(userId, profileImage); // DB에 이미지 URL 업데이트
        }

        return {
          userId,
          accessToken: socialAccessToken,
          refreshToken: socialRefreshToken,
        };
      } else {
        // 존재하지 않는 사용자인 경우
        const newUser = await this.userRepository.createUser(userInfo);
        const userId = newUser.id;
        if (!profileImage) {
          await this.userImageRepository.uploadUserImage(
            userId,
            process.env.DEFAULT_USER_IMAGE,
          );
        } else {
          await this.userImageRepository.uploadUserImage(userId, profileImage);
        }
        return {
          userId,
          socialAccessToken,
          socialRefreshToken,
        };
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        '소셜 로그인 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async unlink(accessToken: string, refreshToken: string, provider: string) {}

  async kakaoLogout(accessToken: string, refreshToken: string) {
    try {
      const checkValidKakaoToken =
        await this.tokenService.checkValidKakaoToken(accessToken);
      if (checkValidKakaoToken === 401) {
        const newKakaoToken =
          await this.tokenService.getNewKakaoToken(refreshToken);
        accessToken = newKakaoToken.access_token;
      }

      const kakaoLogoutUrl = 'https://kapi.kakao.com/v1/user/logout';
      const kakaoLogoutHeader = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      axios.post(kakaoLogoutUrl, {}, kakaoLogoutHeader);
      return { message: '카카오 로그아웃이 완료되었습니다.' };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        '카카오 로그아웃 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async kakaoUnlink(accessToken: string, refreshToken: string) {
    try {
      const checkValidKakaoToken =
        await this.tokenService.checkValidKakaoToken(accessToken);
      if (checkValidKakaoToken === 401) {
        const newKakaoToken =
          await this.tokenService.getNewKakaoToken(refreshToken);
        accessToken = newKakaoToken.access_token;
      }

      const kakaoUnlinkUrl = 'https://kapi.kakao.com/v1/user/unlink';
      const kakaoUnlinkHeader = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      axios.post(kakaoUnlinkUrl, {}, kakaoUnlinkHeader);
      return { message: '카카오 연결 끊기가 완료되었습니다.' };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        '카카오 연결 끊기 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async naverUnlink(accessToken: string, refreshToken: string) {
    try {
      const checkValidNaverToken =
        await this.tokenService.checkValidNaverToken(accessToken);
      if (checkValidNaverToken === 401) {
        const newNaverToken =
          await this.tokenService.getNewNaverToken(refreshToken);
        accessToken = newNaverToken.access_token;
      }

      const naverUnlinkUrl = 'https://nid.naver.com/oauth2.0/token';
      const naverUnlinkHeader = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const naverUnlinkBody = {
        client_id: process.env.NAVER_CLIENT_ID,
        client_secret: process.env.NAVER_CLIENT_SECRET,
        grant_type: 'delete',
        service_provider: 'NAVER',
      };

      axios.post(naverUnlinkUrl, naverUnlinkBody, naverUnlinkHeader);
      return { message: '네이버 연동 해제가 완료되었습니다.' };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        '네이버 연결 끊기 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async accountDelete(userId: number) {
    const deleteUser = await this.userRepository.deleteUser(userId);
    if (!deleteUser) {
      throw new HttpException(
        '사용자를 찾을 수 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    return { message: '사용자 계정 삭제가 완료되었습니다.' };
  }
}
