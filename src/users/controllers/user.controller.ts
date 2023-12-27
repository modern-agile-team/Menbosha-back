import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { ApiGetMyInfo } from '../swagger-decorators/get-my-info-decorator';
import { ApiGetMyInfoWithOwner } from '../swagger-decorators/get-my-info-with-owner-decorator';
import { PageByMentorListResponseDTO } from '../dtos/page-by-mentor-list-response-dto';
import { ApiGetPageNumberByMentor } from '../swagger-decorators/get-mentor-page-decorator';

@Controller('user')
@ApiTags('user API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiGetMyInfo()
  @UseGuards(JwtAccessTokenGuard)
  @Get('my-info')
  async getMyInfo(@GetUserId() userId: number) {
    return this.userService.getMyInfo(userId);
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

  @Get('mentor_list')
  getMentorList(
    @Query('page') page: 1,
  ): Promise<{ data: PageByMentorListResponseDTO[] }> {
    return this.userService.getMentorList(page);
  }
}
