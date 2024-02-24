import { AuthService } from '../services/auth.service';
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
import { S3Service } from '@src/common/s3/s3.service';
import { TokenService } from '../services/token.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiNaverLogin } from '../swagger-decorators/naver-login.decorator';
import { ApiKakaoLogin } from '../swagger-decorators/kakao-login.decorator';
import { ApiNewAccessToken } from '../swagger-decorators/new-access-token.decorator';
import { ApiKakaoLogout } from '../swagger-decorators/kakao-logout.decorator';
import { ApiKakaoUnlink } from '../swagger-decorators/kakao-unlink.decorator';
import { ApiNaverLogout } from '../swagger-decorators/naver-logout.decorator';
import { ApiNaverUnlink } from '../swagger-decorators/naver-unlink.decorator';
import { ApiDeleteAccount } from '../swagger-decorators/delete-account.decorator';
import { GetUserId } from '@src/common/decorators/get-userId.decorator';
import { ApiGoogleLogin } from '../swagger-decorators/google-login.decorator';
import { ApiGoogleLogout } from '../swagger-decorators/google-logout.decorator';
import { ApiGoogleUnlink } from '../swagger-decorators/google-unlink.decorator';
import {
  AccessTokenAuthGuard,
  RefreshTokenAuthGuard,
} from '../jwt/jwt-auth.guard';
import { Provider } from '../enums/provider.enum';
import { CookieInterceptor } from '@src/common/interceptors/cookie.interceptor';

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

    return this.authService.login(code, Provider.Naver);
  }

  @ApiKakaoLogin()
  @UseInterceptors(CookieInterceptor)
  @Get('kakao/login')
  kakaoLogin(@Query('code') code: string) {
    if (!code) {
      throw new BadRequestException('인가코드가 없습니다.');
    }

    return this.authService.login(code, Provider.Kakao);
  }

  @ApiGoogleLogin()
  @UseInterceptors(CookieInterceptor)
  @Get('google/login')
  googleLogin(@Query('code') code: string) {
    if (!code) {
      throw new BadRequestException('인가코드가 없습니다.');
    }

    return this.authService.login(code, Provider.Google);
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

    await this.tokenService.deleteTokens(userId);

    return this.authService.unlink(
      Provider.Kakao,
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

    await this.tokenService.deleteTokens(userId);

    return this.authService.unlink(
      Provider.Naver,
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

    await this.tokenService.deleteTokens(userId);

    return this.authService.unlink(Provider.Google, socialAccessToken);
  }

  @ApiDeleteAccount()
  @UseGuards(AccessTokenAuthGuard)
  @Delete('account')
  async accountDelete(@GetUserId() userId: number) {
    await this.s3Service.deleteImagesWithPrefix(`${userId}_`);
    return this.authService.accountDelete(userId);
  }
}
