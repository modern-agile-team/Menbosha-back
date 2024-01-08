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

  @UseGuards(JwtAccessTokenGuard)
  @Post(':boardId/like')
  createMentorBoardLike(
    @GetUserId() userId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return this.mentorBoardSLikeService.createMentorBoardLike(boardId, userId);
  }

  @UseGuards(JwtOptionalGuard)
  @Get(':boardId/like')
  getMentorBoardLike(
    @GetUserId() userId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return this.mentorBoardSLikeService.getMentorBoardLikes(boardId, userId);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Delete(':boardId/like')
  deleteMentorBoardLike(
    @GetUserId() userId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return this.mentorBoardSLikeService.deleteMentorBoardLike(boardId, userId);
  }
}
