import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as dotenv from 'dotenv';
import axios from 'axios';
import { TotalCountService } from '@src/total-count/services/total-count.service';
import { DataSource } from 'typeorm';
import { UserService } from '@src/users/services/user.service';
import { UserImageService } from '@src/users/services/user-image.service';
import { UserStatus } from '@src/users/constants/user-status.enum';
import { UserInfo } from '@src/auth/interfaces/user-info.interface';
import { Provider } from '@src/auth/enums/provider.enum';
import { TokenService } from '@src/auth/services/token.service';
import { AuthServiceInterface } from '@src/auth/interfaces/auth-service.interface';
import { BannedUsersService } from '@src/admins/banned-user/services/banned-users.service';
import { BannedUserException } from '@src/http-exceptions/exceptions/banned-user.exception';
import { AUTH_ERROR_CODE } from '@src/constants/error/auth/auth-error-code.constant';
import { BannedUserErrorResponseDto } from '@src/admins/banned-user/dtos/banned-user-error-response.dto';

dotenv.config();

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    private readonly userService: UserService,
    private readonly userImageService: UserImageService,
    private readonly tokenService: TokenService,
    private readonly totalCountService: TotalCountService,
    private readonly bannedUsersService: BannedUsersService,
    private readonly dataSource: DataSource,
  ) {}

  async login(authorizeCode: string, provider: Provider) {
    try {
      let tokenUrl: string,
        tokenHeader: object,
        tokenBody: object,
        userInfoUrl: string,
        userInfoHeader: object;

      if (provider === Provider.Naver) {
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
      } else if (provider === Provider.Kakao) {
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
      } else if (provider === Provider.Google) {
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

      if (provider === Provider.Naver) {
        // 네이버 로그인 사용자 정보 조회
        userInfoUrl = 'https://openapi.naver.com/v1/nid/me';
        userInfoHeader = {
          headers: {
            Authorization: `Bearer ${socialAccessToken}`,
          },
        };
      } else if (provider === Provider.Kakao) {
        // 카카오 로그인 사용자 정보 조회
        userInfoUrl = 'https://kapi.kakao.com/v2/user/me';
        userInfoHeader = {
          headers: {
            Authorization: `Bearer ${socialAccessToken}`,
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        };
      } else if (provider === Provider.Google) {
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

      let name = null;
      let email = null;
      let profileImage = null;

      if (provider === Provider.Naver) {
        name = socialUserInfo.response.nickname; // 네이버 닉네임
        email = socialUserInfo.response.email; // 네이버 이메일
        profileImage = socialUserInfo.response.profile_image; // 네이버 프로필 이미지
      } else if (provider === Provider.Kakao) {
        name = socialUserInfo.kakao_account.profile.nickname; // 카카오 닉네임
        email = socialUserInfo.kakao_account.email; // 카카오 이메일
        profileImage = socialUserInfo.kakao_account.profile.profile_image_url; // 카카오 프로필 이미지
      } else if (provider === Provider.Google) {
        name = socialUserInfo.name; // Google 닉네임
        email = socialUserInfo.email; // Google 이메일
        profileImage = socialUserInfo.picture; // Google 프로필 이미지
      }

      const userInfo: UserInfo = {
        provider,
        name,
        email,
      };

      const user = await this.userService.findOne({
        where: { email, provider },
        withDeleted: true,
      });

      /**
       * @todo 추후 기획에 따라 유저를 restore하는 방식을 정해야 함.
       * 현재 - 탈퇴 후 다시 로그인 하면 자동 복원.
       * 방법 1. NotFound 에러를 던짐.(문의를 통해서만 복구 가능. 근데 현재 기획 상 별도의 문의 페이지가 없음.)
       * 방법 2. 탈퇴된 계정 전용 페이지를 만듬. 복구요청(별도의 api 만들기) 혹은 그대로 사이트 나가기
       * 방법 3. 자동 복원(현재)
       */
      if (user?.deletedAt && user?.status === UserStatus.INACTIVE) {
        user.status = UserStatus.ACTIVE;
        user.deletedAt = null;

        const updateResult = await this.userService.updateUser(user.id, {
          ...user,
        });

        if (!updateResult.affected) {
          throw new InternalServerErrorException(
            'Unknown server error during user sign-in.',
          );
        }
      }

      if (!user?.deletedAt && user?.status === UserStatus.INACTIVE) {
        const existBannedUser = await this.bannedUsersService.findOneByUserId(
          user.id,
        );

        if (!existBannedUser) {
          throw new InternalServerErrorException(
            'User disabled for unknown reason.',
          );
        }

        if (existBannedUser.endAt > new Date()) {
          throw new BannedUserException(
            { code: AUTH_ERROR_CODE.BANNED_USER },
            { ...new BannedUserErrorResponseDto(existBannedUser) },
          );
        }

        if (existBannedUser.endAt <= new Date()) {
          user.status = UserStatus.ACTIVE;

          const updateResult = await this.userService.updateUser(user.id, {
            ...user,
          });

          if (!updateResult.affected) {
            throw new InternalServerErrorException(
              'Unknown server error during user sign-in.',
            );
          }
        }
      }

      if (user) {
        const userId = user.id;

        await this.userService.updateUser(userId, { name });

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
        const accessToken = this.tokenService.generateAccessToken(userId);
        const refreshToken = this.tokenService.generateRefreshToken(userId);
        await this.tokenService.saveTokens(
          userId,
          accessToken,
          refreshToken,
          socialAccessToken,
          socialRefreshToken,
        );

        return {
          accessToken,
          refreshToken,
          firstLogin: false,
        };
      }

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

        const accessToken = this.tokenService.generateAccessToken(userId);
        const refreshToken = this.tokenService.generateRefreshToken(userId);
        await this.tokenService.saveTokens(
          userId,
          accessToken,
          refreshToken,
          socialAccessToken,
          socialRefreshToken,
        );

        return {
          accessToken,
          refreshToken,
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
    } catch (error) {
      console.log(error);

      if (error instanceof BannedUserException) {
        throw error;
      }

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
    provider: Provider,
    accessToken: string,
    refreshToken?: string,
  ): Promise<object> {
    try {
      let checkValidAccessToken: number,
        unlinkUrl: string,
        unlinkHeader: object,
        unlinkBody: object;

      if (provider === Provider.Kakao) {
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
      } else if (provider === Provider.Naver) {
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
      } else if (provider === Provider.Google) {
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
      status: UserStatus.INACTIVE,
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
