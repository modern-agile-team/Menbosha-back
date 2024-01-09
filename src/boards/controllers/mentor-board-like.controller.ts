import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
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
import { JwtOptionalGuard } from 'src/config/guards/jwt-optional.guard';
import { ApiCreateMentorBoardLike } from '../swagger-decorators/mentorBoard/create-mentor-board-like.decorator';
import { ApiGetMentorBoardLikes } from '../swagger-decorators/mentorBoard/get-mentor-board-likes.decorator';
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
@Controller('mentorBoard')
export class MentorBoardLikeController {
  constructor(
    private readonly mentorBoardSLikeService: MentorBoardLikeService,
  ) {}

  @ApiCreateMentorBoardLike()
  @UseGuards(JwtAccessTokenGuard)
  @Post(':boardId/like')
  createMentorBoardLikeAndHotPost(
    @GetUserId() userId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
  ): Promise<{ isLike: boolean }> {
    return this.mentorBoardSLikeService.createMentorBoardLikeAndHotPost(
      boardId,
      userId,
    );
  }

  @ApiGetMentorBoardLikes()
  @UseGuards(JwtOptionalGuard)
  @Get(':boardId/like')
  getMentorBoardLikes(
    @GetUserId() userId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
  ): Promise<{ isLike: boolean; boardLikesCount: number }> {
    return this.mentorBoardSLikeService.getMentorBoardLikes(boardId, userId);
  }

  @ApiDeleteMentorBoardLike()
  @UseGuards(JwtAccessTokenGuard)
  @Delete(':boardId/like')
  deleteMentorBoardLike(
    @GetUserId() userId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
  ): Promise<{ isLike: boolean }> {
    return this.mentorBoardSLikeService.deleteMentorBoardLike(boardId, userId);
  }
}
