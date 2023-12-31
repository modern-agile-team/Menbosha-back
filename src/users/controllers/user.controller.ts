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

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('user API')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userIntroService: UserIntroService,
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

  @Get('/page')
  @ApiGetPageNumberByMentor()
  countPageMentor() {
    return this.userService.countPageMentors();
  }

  @Get('mentor-list')
  @ApiGetMentorList()
  getMentorList(
    @Query('page') page: 1,
  ): Promise<{ data: PageByMentorListResponseDTO[] }> {
    return this.userService.getMentorList(page);
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
  @Patch('/intro')
  patchUserIntro(
    @GetUserId() userId: number,
    @Body() userData: UpdateUserIntroDTO,
  ): Promise<ResponseUserIntroDto> {
    return this.userIntroService.updateUserIntro(userId, userData);
  }
}
