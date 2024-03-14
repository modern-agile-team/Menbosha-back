import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { S3Service } from '@src/common/s3/services/s3.service';
import { ApiTags } from '@nestjs/swagger';
import { GetUserId } from '@src/common/decorators/get-userId.decorator';
import { CookieInterceptor } from '@src/common/interceptors/cookie.interceptor';
import {
  RefreshTokenAuthGuard,
  AccessTokenAuthGuard,
} from '@src/auth/jwt/jwt-auth.guard';
import { TokenService } from '@src/auth/services/token.service';
import { ApiDeleteAccount } from '@src/auth/swagger-decorators/delete-account.decorator';
import { ApiGoogleLogin } from '@src/auth/swagger-decorators/google-login.decorator';
import { ApiGoogleLogout } from '@src/auth/swagger-decorators/google-logout.decorator';
import { ApiGoogleUnlink } from '@src/auth/swagger-decorators/google-unlink.decorator';
import { ApiKakaoLogin } from '@src/auth/swagger-decorators/kakao-login.decorator';
import { ApiKakaoLogout } from '@src/auth/swagger-decorators/kakao-logout.decorator';
import { ApiKakaoUnlink } from '@src/auth/swagger-decorators/kakao-unlink.decorator';
import { ApiNaverLogin } from '@src/auth/swagger-decorators/naver-login.decorator';
import { ApiNaverLogout } from '@src/auth/swagger-decorators/naver-logout.decorator';
import { ApiNaverUnlink } from '@src/auth/swagger-decorators/naver-unlink.decorator';
import { ApiNewAccessToken } from '@src/auth/swagger-decorators/new-access-token.decorator';
import { UserProvider } from '@src/auth/enums/user-provider.enum';
import { AuthService } from '@src/auth/services/auth.service';

@Controller('auth')
@ApiTags('auth API')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly s3Service: S3Service,
  ) {}

  @ApiNaverLogin()
  @UseInterceptors(CookieInterceptor)
  @Get('naver/login')
  naverLogin(@Query('code') code: string) {
    if (!code) {
      throw new BadRequestException('인가코드가 없습니다.');
    }

    return this.authService.login(code, UserProvider.Naver);
  }

  @ApiKakaoLogin()
  @UseInterceptors(CookieInterceptor)
  @Get('kakao/login')
  kakaoLogin(@Query('code') code: string) {
    if (!code) {
      throw new BadRequestException('인가코드가 없습니다.');
    }

    return this.authService.login(code, UserProvider.Kakao);
  }

  @ApiGoogleLogin()
  @UseInterceptors(CookieInterceptor)
  @Get('google/login')
  googleLogin(@Query('code') code: string) {
    if (!code) {
      throw new BadRequestException('인가코드가 없습니다.');
    }

    return this.authService.login(code, UserProvider.Google);
  }

  @ApiNewAccessToken()
  @UseGuards(RefreshTokenAuthGuard)
  @Get('new-access-token')
  newAccessToken(@GetUserId() userId: number) {
    return this.tokenService.generateNewAccessToken(userId);
  }

  @ApiKakaoLogout()
  @UseGuards(AccessTokenAuthGuard)
  @Post('kakao/logout')
  async kakaoLogout(@GetUserId() userId: number) {
    const { socialAccessToken, socialRefreshToken } =
      await this.tokenService.getUserTokens(userId);

    await this.tokenService.deleteTokens(userId);

    return this.authService.kakaoLogout(socialAccessToken, socialRefreshToken);
  }

  @ApiKakaoUnlink()
  @UseGuards(AccessTokenAuthGuard)
  @Post('kakao/unlink')
  async kakaoUnlink(@GetUserId() userId: number) {
    const { socialAccessToken, socialRefreshToken } =
      await this.tokenService.getUserTokens(userId);

    return this.authService.unlink(
      UserProvider.Kakao,
      socialAccessToken,
      socialRefreshToken,
    );
  }

  @ApiNaverLogout()
  @UseGuards(AccessTokenAuthGuard)
  @Post('naver/logout')
  naverLogout(@GetUserId() userId: number) {
    return this.tokenService.deleteTokens(userId);
  }

  @ApiNaverUnlink()
  @UseGuards(AccessTokenAuthGuard)
  @Post('naver/unlink')
  async naverUnlink(@GetUserId() userId: number) {
    const { socialAccessToken, socialRefreshToken } =
      await this.tokenService.getUserTokens(userId);

    return this.authService.unlink(
      UserProvider.Naver,
      socialAccessToken,
      socialRefreshToken,
    );
  }

  @ApiGoogleLogout()
  @UseGuards(AccessTokenAuthGuard)
  @Post('google/logout')
  googleLogout(@GetUserId() userId: number) {
    return this.tokenService.deleteTokens(userId);
  }

  @ApiGoogleUnlink()
  @UseGuards(AccessTokenAuthGuard)
  @Post('google/unlink')
  async googleUnlink(@GetUserId() userId: number) {
    const { socialAccessToken } = await this.tokenService.getUserTokens(userId);

    return this.authService.unlink(UserProvider.Google, socialAccessToken);
  }

  @ApiDeleteAccount()
  @UseGuards(AccessTokenAuthGuard)
  @Delete('account')
  async accountDelete(@GetUserId() userId: number) {
    await this.s3Service.deleteImagesWithPrefix(`${userId}_`);
    return this.authService.accountDelete(userId);
  }
}
