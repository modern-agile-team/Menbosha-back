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
import { UserService } from '../services/user.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { ApiGetMyProfile } from '../swagger-decorators/get-my-profile-decorator';
import { ApiGetMyInfoWithOwner } from '../swagger-decorators/get-my-info-with-owner-decorator';
import { PageByMentorListResponseDTO } from '../dtos/page-by-mentor-list-response-dto';
import { ApiGetPageNumberByMentor } from '../swagger-decorators/get-mentor-page-decorator';
import { ApiGetMentorList } from '../swagger-decorators/get-mentor-list-decorator';
import { UserIntroService } from '../services/user-intro-service';
import { UserIntro } from '../entities/user-intro.entity';
import { CreateUserIntroDto } from '../dtos/create-user-intro-dto';
import { ResponseUserIntroDto } from '../dtos/response-user-dto';
import { UpdateUserIntroDTO } from '../dtos/update-user-intro-dto';
import { ApiPostUserIntro } from '../swagger-decorators/upload-user-Intro-decorators';
import { ApiUpdateUserIntro } from '../swagger-decorators/patch-user-intro-decorator';
import { ApiGetMyRank } from '../swagger-decorators/get-my-rank-decorators';
import { ApiGetUserInfo } from '../swagger-decorators/get-user-info.decorators';
import { UserRankingService } from '../services/user-ranking.service';
import { ApiGetTotalRanking } from '../swagger-decorators/get-total-ranking.decorator';
import { MentorListPageQueryDto } from '../dtos/mentor-list-page-query.dto';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('user API')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userIntroService: UserIntroService,
    private readonly userRankingService: UserRankingService,
  ) {}

  @ApiGetMyProfile()
  @UseGuards(JwtAccessTokenGuard)
  @Get('my/profile')
  async getMyProfile(@GetUserId() userId: number) {
    return this.userService.getMyProfile(userId);
  }

  @ApiGetMyRank()
  @UseGuards(JwtAccessTokenGuard)
  @Get('my/rank')
  async getMyRank(@GetUserId() userId: number) {
    return this.userService.getMyRank(userId);
  }

  @ApiGetUserInfo()
  @Get('info')
  async getUserInfo(@Query('userId') userId: number) {
    return this.userService.getUserInfo(userId);
  }

  @UseGuards(JwtAccessTokenGuard)
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

  // 카테고리 id별 멘토 리스트 불러오기(페이지네이션) 추가
  @Get('mentor-list')
  @ApiGetMentorList()
  getMentorList(
    @Query() mentorListPageQueryDto: MentorListPageQueryDto,
  ): Promise<{ data: PageByMentorListResponseDTO[] }> {
    return this.userService.getMentorList(
      mentorListPageQueryDto.page,
      mentorListPageQueryDto.activityCategoryId,
    );
  }

  @ApiGetTotalRanking()
  @Get('total-ranking')
  getUserRanking() {
    return this.userRankingService.getUserRanking();
  }

  @UseGuards(JwtAccessTokenGuard)
  @ApiPostUserIntro()
  @Post('/intro')
  addUserIntro(
    @GetUserId() userId: number,
    @Body() userData: CreateUserIntroDto,
  ): Promise<UserIntro> {
    return this.userIntroService.addUserIntro(userId, userData);
  }

  @UseGuards(JwtAccessTokenGuard)
  @ApiUpdateUserIntro()
  @Patch('/my/intro')
  patchMyIntro(
    @GetUserId() userId: number,
    @Body() userData: UpdateUserIntroDTO,
  ): Promise<ResponseUserIntroDto> {
    return this.userIntroService.updateMyIntro(userId, userData);
  }
}
