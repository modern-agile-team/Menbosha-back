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
import { MentorBoardHotPostsService } from '../services/mentor-board-hot-posts.service';
import { MentorBoardPageQueryDto } from '../dto/mentorBoard/mentor-board-page-query.dto';
import { ResponseMentorBoardHotPostPaginationDto } from '../dto/mentorBoard/response-mentor-board-hot-post-pagination.dto';
import { ApiFindAllHotPostsWithPagination } from '../swagger-decorators/mentorBoard/find-all-hot-posts-with-pagination.decorator';

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

  @ApiFindAllHotPostsWithPagination()
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
