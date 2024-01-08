import {
  ClassSerializerInterceptor,
  Controller,
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
import { JwtOptionalGuard } from 'src/config/guards/jwt-optional.guard';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';

@ApiTags('mentor-board-like')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@UseInterceptors(SuccessResponseInterceptor, ClassSerializerInterceptor)
@Controller('mentorBoard/like')
export class MentorBoardLikeController {
  constructor(
    private readonly mentorBoardSLikeService: MentorBoardLikeService,
  ) {}

  @UseGuards(JwtAccessTokenGuard)
  @Post(':boardId')
  createBoardLike(
    @GetUserId() userId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    return this.mentorBoardSLikeService.createBoardLike(userId, boardId);
  }
}
