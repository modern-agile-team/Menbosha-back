import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SuccessResponseInterceptor } from 'src/common/interceptors/success-response.interceptor';
import { plainToInstance } from 'class-transformer';
import { ResponseMentorBoardHotPostsItemDto } from '../dto/mentorBoard/response-mentor-board-hot-posts-item';
import { ApiFindAllMentorBoardHotPostsWithLimit } from '../swagger-decorators/mentorBoard/find-all-mentor-board-hot-posts-with-limit';
import { MentorBoardHotPostsService } from '../services/mentor-board-hot-posts.service';
import { MentorBoardPageQueryDto } from '../dto/mentorBoard/mentor-board-page-query.dto';
import { ResponseMentorBoardHotPostPaginationDto } from '../dto/mentorBoard/response-mentor-board-hot-post-pagination.dto';

@ApiTags('mentor-board-hot-posts')
@UseInterceptors(SuccessResponseInterceptor, ClassSerializerInterceptor)
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@Controller('mentor-board/hot-posts')
export class MentorBoardHotPostsController {
  constructor(
    private readonly mentorBoardHotPostsService: MentorBoardHotPostsService,
  ) {}

  @ApiFindAllMentorBoardHotPostsWithLimit()
  @Get()
  async findAllHotPosts() {
    const mentorBoardHotPosts =
      await this.mentorBoardHotPostsService.findAllMentorBoardHotPostsWithLimit();

    return plainToInstance(
      ResponseMentorBoardHotPostsItemDto,
      mentorBoardHotPosts,
    );
  }

  @Get(':categoryId')
  findAllHotPostsWithPagination(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Query() mentorBoardPageQueryDto: MentorBoardPageQueryDto,
  ): Promise<ResponseMentorBoardHotPostPaginationDto> {
    return this.mentorBoardHotPostsService.findAllMentorBoardHotPostsWithLimitQuery(
      mentorBoardPageQueryDto,
      categoryId,
    );
  }
}
