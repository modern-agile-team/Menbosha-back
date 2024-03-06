import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUserId } from '@src/common/decorators/get-userId.decorator';
import { AccessTokenAuthGuard } from '@src/auth/jwt/jwt-auth.guard';
import { CreateUserIntroDto } from '@src/users/dtos/create-user-intro-dto';
import { ResponseUserIntroDto } from '@src/users/dtos/response-user-dto';
import { UpdateUserIntroDTO } from '@src/users/dtos/update-user-intro-dto';
import { UserIntro } from '@src/users/entities/user-intro.entity';
import { UserBadgeService } from '@src/users/services/user-badge.service';
import { UserIntroService } from '@src/users/services/user-intro-service';
import { UserRankingService } from '@src/users/services/user-ranking.service';
import { UserService } from '@src/users/services/user.service';
import { ApiGetPageNumberByMentor } from '@src/users/swagger-decorators/get-mentor-page-decorator';
import { ApiGetMyInfoWithOwner } from '@src/users/swagger-decorators/get-my-info-with-owner-decorator';
import { ApiGetMyProfile } from '@src/users/swagger-decorators/get-my-profile-decorator';
import { ApiGetMyRank } from '@src/users/swagger-decorators/get-my-rank-decorators';
import { ApiGetTotalRanking } from '@src/users/swagger-decorators/get-total-ranking.decorator';
import { ApiPostUserBadges } from '@src/users/swagger-decorators/get-user-badges-decorator';
import { ApiGetUserInfo } from '@src/users/swagger-decorators/get-user-info.decorators';
import { ApiUpdateUserIntro } from '@src/users/swagger-decorators/patch-user-intro-decorator';
import { ApiPostUserIntro } from '@src/users/swagger-decorators/upload-user-Intro-decorators';
import { ParsePositiveIntPipe } from '@src/common/pipes/parse-positive-int.pipe';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('user API')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userIntroService: UserIntroService,
    private readonly userRankingService: UserRankingService,
    private readonly userBadgeService: UserBadgeService,
  ) {}

  @ApiGetMyProfile()
  @UseGuards(AccessTokenAuthGuard)
  @Get('my/profile')
  async getMyProfile(@GetUserId() userId: number) {
    return this.userService.getMyProfile(userId);
  }

  @ApiGetMyRank()
  @UseGuards(AccessTokenAuthGuard)
  @Get('my/rank')
  async getMyRank(@GetUserId() userId: number) {
    return this.userService.getMyRank(userId);
  }

  @ApiGetUserInfo()
  @Get(':userId/info')
  getUserInfo(@Param('userId', ParsePositiveIntPipe) userId: number) {
    return this.userService.getUserInfo(userId);
  }

  @UseGuards(AccessTokenAuthGuard)
  @ApiGetMyInfoWithOwner()
  @Get('my-info/:targetId')
  async getMyInfoWithOwner(
    @GetUserId() userId: number,
    @Param('targetId', ParseIntPipe) targetId: number,
  ) {
    return this.userService.getMyInfoWithOwner(userId, targetId);
  }

  /**
   * @deprecated 추후 클라이언트 로직이 변경됨에 따라 사라질 api
   */
  @Get('/page')
  @ApiGetPageNumberByMentor()
  countPageMentor(@Query('categoryId') categoryId: number) {
    return this.userService.countPageMentors(categoryId);
  }

  @ApiGetTotalRanking()
  @Get('total-ranking')
  getUserRanking() {
    return this.userRankingService.getUserRanking();
  }

  @UseGuards(AccessTokenAuthGuard)
  @ApiPostUserIntro()
  @Post('/intro')
  addUserIntro(
    @GetUserId() userId: number,
    @Body() userData: CreateUserIntroDto,
  ): Promise<UserIntro> {
    return this.userIntroService.addUserIntro(userId, userData);
  }

  @UseGuards(AccessTokenAuthGuard)
  @ApiUpdateUserIntro()
  @Patch('/my/intro')
  patchMyIntro(
    @GetUserId() userId: number,
    @Body() userData: UpdateUserIntroDTO,
  ): Promise<ResponseUserIntroDto> {
    return this.userIntroService.updateMyIntro(userId, userData);
  }

  @ApiPostUserBadges()
  @Post(':userId/badges')
  getUserBadge(@Param('userId') userId: number) {
    return this.userBadgeService.checkUserBadges(userId);
  }
}
