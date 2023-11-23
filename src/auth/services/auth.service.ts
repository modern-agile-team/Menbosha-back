import { TokenService } from './token.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/repositories/user.repository';
import * as dotenv from 'dotenv';
import { UserImageRepository } from 'src/users/repositories/user-image.repository';
import axios from 'axios';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userImageRepository: UserImageRepository,
    private readonly tokenService: TokenService,
  ) {}

  async naverLogin(authorizeCode: string) {
    try {
      const naverTokenUrl = 'https://nid.naver.com/oauth2.0/token';
      const naverTokenHeader = {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      };
      const naverTokenBody = {
        grant_type: 'authorization_code',
        client_id: process.env.NAVER_CLIENT_ID,
        client_secret: process.env.NAVER_CLIENT_SECRET,
        code: authorizeCode,
        state: 'test',
        redirect_uri: process.env.NAVER_CALLBACK_URL,
      };

      const naverToken = (
        await axios.post(naverTokenUrl, naverTokenBody, naverTokenHeader)
      ).data;

      const naverAccessToken = naverToken.access_token;
      const naverRefreshToken = naverToken.refresh_token;

      const naverUserInfoUrl = 'https://openapi.naver.com/v1/nid/me';
      const naverUserInfoHeader = {
        headers: {
          Authorization: `Bearer ${naverAccessToken}`,
        },
      };

      const naverUserInfo = (
        await axios.get(naverUserInfoUrl, naverUserInfoHeader)
      ).data;
      const nickname = naverUserInfo.response.nickname;
      const email = naverUserInfo.response.email;
      const profileImage = naverUserInfo.response.profile_image;
      const gender = naverUserInfo.response.gender;
      const provider = 'naver';
      const userInfo = {
        provider,
        nickname,
        email,
        gender,
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

        return { userId, naverAccessToken, naverRefreshToken };
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
        return { userId, naverAccessToken, naverRefreshToken };
      }
    } catch (error) {
      if (error.response.status == 401) {
        throw new HttpException(
          '유효하지 않은 인가코드입니다.',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }

  async kakaoLogin(authorizeCode: string) {
    try {
      const kakaoTokenUrl = 'https://kauth.kakao.com/oauth/token';
      const kakaoTokenHeader = {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      };
      const kakaoTokenBody = {
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_CLIENT_ID,
        redirect_uri: process.env.KAKAO_CALLBACK_URL,
        code: authorizeCode,
      };

      const kakaoToken = (
        await axios.post(kakaoTokenUrl, kakaoTokenBody, kakaoTokenHeader)
      ).data;
      const kakaoAccessToken = kakaoToken.access_token;
      const kakaoRefreshToken = kakaoToken.refresh_token;

      const kakaoUserInfoUrl = 'https://kapi.kakao.com/v2/user/me';
      const kakaoUserInfoHeader = {
        headers: {
          Authorization: `Bearer ${kakaoAccessToken}`,
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      };

      const kakaoUserInfo = (
        await axios.get(kakaoUserInfoUrl, kakaoUserInfoHeader)
      ).data;
      const nickname = kakaoUserInfo.properties.nickname;
      const email = kakaoUserInfo.kakao_account.email;
      const profileImage = kakaoUserInfo.properties.profile_image;
      const gender = kakaoUserInfo.kakao_account.gender == 'male' ? 'M' : 'F';
      const provider = 'kakao';
      const userInfo = {
        provider,
        nickname,
        email,
        gender,
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

        return { userId, kakaoAccessToken, kakaoRefreshToken };
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
        return { userId, kakaoAccessToken, kakaoRefreshToken };
      }
    } catch (error) {
      if (error.response.status == 400) {
        throw new HttpException(
          '유효하지 않은 인가코드입니다.',
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        console.log(error);
        throw new HttpException(
          '카카오 로그인 중 오류가 발생했습니다.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

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
