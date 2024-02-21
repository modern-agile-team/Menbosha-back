import { AuthService } from '../services/auth.service';
import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { S3Service } from 'src/common/s3/s3.service';
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
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { RedisService } from 'src/common/redis/redis.service';
import { ApiGoogleLogin } from '../swagger-decorators/google-login.decorator';
import { ApiGoogleLogout } from '../swagger-decorators/google-logout.decorator';
import { ApiGoogleUnlink } from '../swagger-decorators/google-unlink.decorator';
import {
  AccessTokenAuthGuard,
  RefreshTokenAuthGuard,
} from '../jwt/jwt-auth.guard';
import { Ttl } from 'src/common/redis/ttl.enum';

@Controller('auth')
@ApiTags('auth API')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly s3Service: S3Service,
    private readonly redisService: RedisService,
  ) {}

  @ApiNaverLogin()
  @Get('naver/login')
  async naverLogin(@Query('code') code: string, @Res() res) {
    if (!code) {
      throw new BadRequestException('인가코드가 없습니다.');
    }

    const { userId, socialAccessToken, socialRefreshToken, firstLogin } =
      await this.authService.login(code, 'naver');
    const accessToken = this.tokenService.generateAccessToken(userId);
    const refreshToken = this.tokenService.generateRefreshToken(userId);

    await this.tokenService.saveTokens(
      userId,
      accessToken,
      refreshToken,
      socialAccessToken,
      socialRefreshToken,
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'Lax',
      domain: 'localhost',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    });

    return res.json({ accessToken, refreshToken, firstLogin });
  }

  @ApiKakaoLogin()
  @Get('kakao/login')
  async kakaoLogin(@Query('code') code: string, @Res() res) {
    if (!code) {
      throw new BadRequestException('인가코드가 없습니다.');
    }

    const { userId, socialAccessToken, socialRefreshToken, firstLogin } =
      await this.authService.login(code, 'kakao');
    const accessToken = this.tokenService.generateAccessToken(userId);
    const refreshToken = this.tokenService.generateRefreshToken(userId);

    await this.tokenService.saveTokens(
      userId,
      accessToken,
      refreshToken,
      socialAccessToken,
      socialRefreshToken,
    );

    res.cookie('refresh_Token', refreshToken, {
      httpOnly: true,
      sameSite: 'Lax',
      domain: 'localhost',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    });

    return res.json({ accessToken, refreshToken, firstLogin });
  }

  @ApiGoogleLogin()
  @Get('google/login')
  async googleLogin(@Query('code') code: string, @Res() res) {
    if (!code) {
      throw new BadRequestException('인가코드가 없습니다.');
    }

    const { userId, socialAccessToken, socialRefreshToken, firstLogin } =
      await this.authService.login(code, 'google');
    const accessToken = this.tokenService.generateAccessToken(userId);
    const refreshToken = this.tokenService.generateRefreshToken(userId);

    await this.tokenService.saveTokens(
      userId,
      accessToken,
      refreshToken,
      socialAccessToken,
      socialRefreshToken,
    );

    res.cookie('refresh_Token', refreshToken, {
      httpOnly: true,
      sameSite: 'Lax',
      domain: 'localhost',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    });

    return res.json({ accessToken, refreshToken, firstLogin });
  }

  @ApiNewAccessToken()
  @UseGuards(RefreshTokenAuthGuard)
  @Get('new-access-token')
  async newAccessToken(@GetUserId() userId: number) {
    const newAccessToken = this.tokenService.generateAccessToken(userId);
    await this.redisService.setToken(
      String(userId) + '-accessToken',
      newAccessToken,
      Ttl.accessToken,
    );
    return { accessToken: newAccessToken };
  }

  @ApiKakaoLogout()
  @UseGuards(AccessTokenAuthGuard)
  @Post('kakao/logout')
  async kakaoLogout(@GetUserId() userId: number) {
    const { socialAccessToken, socialRefreshToken } =
      await this.tokenService.getUserTokens(userId);

    await this.tokenService.deleteTokens(userId);

    return await this.authService.kakaoLogout(
      socialAccessToken,
      socialRefreshToken,
    );
  }

  @ApiKakaoUnlink()
  @UseGuards(AccessTokenAuthGuard)
  @Post('kakao/unlink')
  async kakaoUnlink(@GetUserId() userId: number) {
    const { socialAccessToken, socialRefreshToken } =
      await this.tokenService.getUserTokens(userId);

    await this.tokenService.deleteTokens(userId);

    return await this.authService.kakaoUnlink(
      socialAccessToken,
      socialRefreshToken,
    );
  }

  @ApiNaverLogout()
  @UseGuards(AccessTokenAuthGuard)
  @Post('naver/logout')
  async naverLogout(@GetUserId() userId: number) {
    return await this.tokenService.deleteTokens(userId);
  }

  @ApiNaverUnlink()
  @UseGuards(AccessTokenAuthGuard)
  @Post('naver/unlink')
  async naverUnlink(@GetUserId() userId: number) {
    const { socialAccessToken, socialRefreshToken } =
      await this.tokenService.getUserTokens(userId);

    await this.tokenService.deleteTokens(userId);

    return await this.authService.naverUnlink(
      socialAccessToken,
      socialRefreshToken,
    );
  }

  @ApiGoogleLogout()
  @UseGuards(AccessTokenAuthGuard)
  @Post('google/logout')
  async googleLogout(@GetUserId() userId: number) {
    return await this.tokenService.deleteTokens(userId);
  }

  @ApiGoogleUnlink()
  @UseGuards(AccessTokenAuthGuard)
  @Post('google/unlink')
  async googleUnlink(@GetUserId() userId: number) {
    const { socialAccessToken } = await this.tokenService.getUserTokens(userId);

    await this.tokenService.deleteTokens(userId);

    return await this.authService.googleUnlink(socialAccessToken);
  }

  @ApiDeleteAccount()
  @UseGuards(AccessTokenAuthGuard)
  @Delete('account')
  async accountDelete(@GetUserId() userId: number) {
    await this.s3Service.deleteImagesWithPrefix(userId + '_');
    return await this.authService.accountDelete(userId);
  }
}
