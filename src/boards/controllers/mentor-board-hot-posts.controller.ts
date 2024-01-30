import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SuccessResponseInterceptor } from 'src/common/interceptors/success-response.interceptor';
import { MentorBoardHotPostsService } from '../services/mentor-board-hot-posts.service';
import { MentorBoardPageQueryDto } from '../dto/mentorBoard/mentor-board-page-query.dto';
import { MentorBoardHotPostPaginationResponseDto } from '../dto/mentorBoard/mentor-board-hot-post-pagination-response.dto';
import { ApiFindAllHotPostsWithPagination } from '../swagger-decorators/mentorBoard/find-all-hot-posts-with-pagination.decorator';

/**
 * @todo 멘토 보드 기능으로 통합되면 수정
 * 1. api path
 * 2. folder route
 * 3. method name
 */
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
  @Get()
  findAllHotPostsWithPagination(
    @Query() mentorBoardPageQueryDto: MentorBoardPageQueryDto,
  ): Promise<MentorBoardHotPostPaginationResponseDto> {
    return this.mentorBoardHotPostsService.findAllMentorBoardHotPostsWithLimitQuery(
      mentorBoardPageQueryDto,
    );
  }
}
