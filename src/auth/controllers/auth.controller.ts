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
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ApiNaverLogin } from '../swagger-decorators/naver-login.decorator';
import { ApiKakaoLogin } from '../swagger-decorators/kakao-login.decorator';
import { ApiNewAccessToken } from '../swagger-decorators/new-access-token.decorator';
import { ApiKakaoLogout } from '../swagger-decorators/kakao-logout.decorator';
import { ApiKakaoUnlink } from '../swagger-decorators/kakao-unlink.decorator';
import { ApiNaverLogout } from '../swagger-decorators/naver-logout.decorator';
import { ApiNaverUnlink } from '../swagger-decorators/naver-unlink.decorator';
import { ApiDeleteAccount } from '../swagger-decorators/delete-account.decorator';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { JwtRefreshTokenGuard } from 'src/config/guards/jwt-refresh-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';

@Controller('auth')
@ApiTags('auth API')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly s3Service: S3Service,
  ) {}

  @ApiNaverLogin()
  @Get('naver/login')
  async naverLogin(@Query() { code }, @Res() res) {
    if (!code) {
      throw new BadRequestException('인가코드가 없습니다.');
    }

    const { userId, naverAccessToken, naverRefreshToken } =
      await this.authService.naverLogin(code);
    const accessToken = await this.tokenService.createAccessToken(userId);
    const refreshToken = await this.tokenService.createRefreshToken(userId);

    await this.tokenService.saveTokens(
      userId,
      refreshToken,
      naverAccessToken,
      naverRefreshToken,
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'Lax',
      domain: 'localhost',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    });

    return res.json({ accessToken });
  }

  @ApiKakaoLogin()
  @Get('kakao/login')
  async kakaoLogin(@Query() { code }, @Res() res) {
    if (!code) {
      throw new BadRequestException('인가코드가 없습니다.');
    }

    const { userId, kakaoAccessToken, kakaoRefreshToken } =
      await this.authService.kakaoLogin(code);
    const accessToken = await this.tokenService.createAccessToken(userId);
    const refreshToken = await this.tokenService.createRefreshToken(userId);

    await this.tokenService.saveTokens(
      userId,
      refreshToken,
      kakaoAccessToken,
      kakaoRefreshToken,
    );

    res.cookie('refresh_Token', refreshToken, {
      httpOnly: true,
      sameSite: 'Lax',
      domain: 'localhost',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    });

    return res.json({ accessToken });
  }

  @ApiCookieAuth('refresh-token')
  @ApiNewAccessToken()
  @UseGuards(JwtRefreshTokenGuard)
  @Get('new-access-token')
  async newAccessToken(@GetUserId() userId: number, @Res() res) {
    const newAccessToken = await this.tokenService.createAccessToken(userId);
    return res.json({ accessToken: newAccessToken });
  }

  @ApiKakaoLogout()
  @UseGuards(JwtAccessTokenGuard)
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
  @UseGuards(JwtAccessTokenGuard)
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
  @UseGuards(JwtAccessTokenGuard)
  @Post('naver/logout')
  async naverLogout(@GetUserId() userId: number) {
    return await this.tokenService.deleteTokens(userId);
  }

  @ApiNaverUnlink()
  @UseGuards(JwtAccessTokenGuard)
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

  @ApiDeleteAccount()
  @UseGuards(JwtAccessTokenGuard)
  @Delete('account')
  async accountDelete(@GetUserId() userId: number) {
    await this.s3Service.deleteImagesWithPrefix(userId + '_');
    return await this.authService.accountDelete(userId);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Get('status')
  async status() {
    return { success: true };
  }
}
