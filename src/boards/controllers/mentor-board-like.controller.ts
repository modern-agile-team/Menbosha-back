import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SuccessResponseInterceptor } from 'src/common/interceptors/success-response.interceptor';
import { MentorBoardLikeService } from '../services/mentor-board-like.service';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { ApiCreateMentorBoardLike } from '../swagger-decorators/mentorBoard/create-mentor-board-like.decorator';
import { ApiDeleteMentorBoardLike } from '../swagger-decorators/mentorBoard/delete-mentor-board-like.decorator';

@ApiTags('mentor-board-like')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@UseInterceptors(SuccessResponseInterceptor, ClassSerializerInterceptor)
/**
 * @todo restful하게 uri 수정
 */
@Controller('mentorBoard')
export class MentorBoardLikeController {
  constructor(
    private readonly mentorBoardSLikeService: MentorBoardLikeService,
  ) {}

  @ApiCreateMentorBoardLike()
  @UseGuards(JwtAccessTokenGuard)
  @Post(':boardId/like')
  createMentorBoardLike(
    @GetUserId() userId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
  ): Promise<{ isLike: true }> {
    return this.mentorBoardSLikeService.createMentorBoardLike(boardId, userId);
  }

  @ApiDeleteMentorBoardLike()
  @UseGuards(JwtAccessTokenGuard)
  @Delete(':boardId/like')
  deleteMentorBoardLike(
    @GetUserId() userId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
  ): Promise<{ isLike: false }> {
    return this.mentorBoardSLikeService.deleteMentorBoardLike(boardId, userId);
  }
}
