import { TokenService } from './token.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import axios from 'axios';
import { AuthServiceInterface } from '../interfaces/auth-service.interface';
import { TotalCountService } from 'src/total-count/services/total-count.service';
import { DataSource } from 'typeorm';
import { UserService } from 'src/users/services/user.service';
import { UserImageService } from 'src/users/services/user-image.service';

dotenv.config();

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    private readonly userService: UserService,
    private readonly userImageService: UserImageService,
    private readonly tokenService: TokenService,
    private readonly totalCountService: TotalCountService,
    private readonly dataSource: DataSource,
  ) {}

  async login(authorizeCode: string, provider: string) {
    try {
      let tokenUrl: string,
        tokenHeader: object,
        tokenBody: object,
        userInfoUrl: string,
        userInfoHeader: object;

      if (provider === 'naver') {
        // 네이버 토큰 발급
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
          redirect_uri: process.env.NAVER_REDIRECT_URI,
        };
      } else if (provider === 'kakao') {
        // 카카오 토큰 발급
        tokenUrl = 'https://kauth.kakao.com/oauth/token';
        tokenHeader = {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        };
        tokenBody = {
          grant_type: 'authorization_code',
          client_id: process.env.KAKAO_CLIENT_ID,
          redirect_uri: process.env.KAKAO_REDIRECT_URI,
          code: authorizeCode,
        };
      } else if (provider === 'google') {
        // 구글 토큰 발급
        tokenUrl = 'https://oauth2.googleapis.com/token';
        tokenHeader = {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        };
        tokenBody = {
          grant_type: 'authorization_code',
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          code: authorizeCode,
          redirect_uri: process.env.GOOGLE_REDIRECT_URI,
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
      } else if (provider === 'google') {
        // 구글 로그인 사용자 정보 조회
        userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
        userInfoHeader = {
          headers: {
            Authorization: `Bearer ${socialAccessToken}`,
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        };
      }

      const socialUserInfo = (await axios.get(userInfoUrl, userInfoHeader))
        .data;

      const nickname =
        provider === 'naver'
          ? socialUserInfo.response.nickname // 네이버 닉네임
          : provider === 'kakao'
            ? socialUserInfo.kakao_account.profile.nickname // 카카오 닉네임
            : provider === 'google'
              ? socialUserInfo.name // Google 닉네임
              : null;
      const email =
        provider === 'naver'
          ? socialUserInfo.response.email // 네이버 이메일
          : provider === 'kakao'
            ? socialUserInfo.kakao_account.email // 카카오 이메일
            : provider === 'google'
              ? socialUserInfo.email // Google 이메일
              : null;
      const profileImage =
        provider === 'naver'
          ? socialUserInfo.response.profile_image // 네이버 프로필 이미지
          : provider === 'kakao'
            ? socialUserInfo.kakao_account.profile.profile_image.url // 카카오 프로필 이미지
            : provider === 'google'
              ? socialUserInfo.picture // Google 프로필 이미지
              : null;

      const userInfo = {
        provider,
        nickname,
        email,
      };

      const findUser = await this.userService.findUser(email, provider);

      if (findUser) {
        const userId = findUser.id;

        await this.userService.updateUserName(userId, nickname);

        const userImageUrl = (await this.userImageService.findUserImage(userId))
          .imageUrl;
        const imageUrlParts = userImageUrl.split('/');
        const imageProviderInDbImageUrl =
          imageUrlParts[imageUrlParts.length - 3];

        if (imageProviderInDbImageUrl !== process.env.AWS_S3_URL) {
          // S3에 업로드된 이미지가 아닌 경우
          await this.userImageService.updateUserImageByUrl(
            userId,
            profileImage,
          ); // DB에 이미지 URL 업데이트
        }

        return {
          userId,
          socialAccessToken,
          socialRefreshToken,
          firstLogin: false,
        };
      } else {
        // 존재하지 않는 사용자인 경우
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
          const entityManager = queryRunner.manager;

          const newUser = await this.userService.createUser(
            entityManager,
            userInfo,
          );
          const userId = newUser.id;
          if (!profileImage) {
            await this.userImageService.uploadUserImageWithEntityManager(
              entityManager,
              userId,
              process.env.DEFAULT_USER_IMAGE,
            );
          } else {
            await this.userImageService.uploadUserImageWithEntityManager(
              entityManager,
              userId,
              profileImage,
            );
          }
          await this.totalCountService.createTotalCount(entityManager, userId);
          await this.totalCountService.createMentorReviewChecklistCount(
            entityManager,
            userId,
          );

          await queryRunner.commitTransaction();

          return {
            userId,
            socialAccessToken,
            socialRefreshToken,
            firstLogin: true,
          };
        } catch (error) {
          if (queryRunner.isTransactionActive) {
            await queryRunner.rollbackTransaction();
          }

          console.error(error);

          throw new HttpException(
            '사용자 생성 중 오류가 발생했습니다.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        } finally {
          if (!queryRunner.isReleased) {
            await queryRunner.release();
          }
        }
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `${provider} 로그인 중 오류가 발생했습니다.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

  async unlink(
    provider: string,
    accessToken: string,
    refreshToken?: string,
  ): Promise<any> {
    try {
      let checkValidAccessToken: number,
        unlinkUrl: string,
        unlinkHeader: object,
        unlinkBody: object;

      if (provider === 'kakao') {
        checkValidAccessToken =
          await this.tokenService.checkValidKakaoToken(accessToken);

        if (checkValidAccessToken === 401) {
          accessToken = (await this.tokenService.getNewKakaoToken(refreshToken))
            .access_token;
        }

        unlinkUrl = 'https://kapi.kakao.com/v1/user/unlink';
        unlinkHeader = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        unlinkBody = {};
      } else if (provider === 'naver') {
        checkValidAccessToken =
          await this.tokenService.checkValidNaverToken(accessToken);

        if (checkValidAccessToken === 401) {
          accessToken = (await this.tokenService.getNewNaverToken(refreshToken))
            .access_token;
        }

        unlinkUrl = 'https://nid.naver.com/oauth2.0/token';
        unlinkHeader = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        unlinkBody = {
          client_id: process.env.NAVER_CLIENT_ID,
          client_secret: process.env.NAVER_CLIENT_SECRET,
          grant_type: 'delete',
          service_provider: 'NAVER',
        };
      } else if (provider === 'google') {
        unlinkUrl = `https://accounts.google.com/o/oauth2/revoke?token=${accessToken}`;
        unlinkHeader = {};
        unlinkBody = {};
      }

      axios.post(unlinkUrl, unlinkBody, unlinkHeader);

      return { message: `${provider} 연결 끊기가 완료되었습니다.` };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `${provider} 연결 끊기 중 오류가 발생했습니다.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async accountDelete(userId: number) {
    const deleteUser = await this.userService.updateUser(userId, {
      deletedAt: new Date(),
    });
    if (!deleteUser) {
      throw new HttpException(
        '사용자를 찾을 수 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    return { message: '사용자 계정 삭제가 완료되었습니다.' };
  }
}
