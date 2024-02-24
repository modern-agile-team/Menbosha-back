import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SuccessResponseInterceptor } from '@src/common/interceptors/success-response.interceptor';
import { MentorBoardLikeService } from '../services/mentor-board-likes.service';
import { GetUserId } from '@src/common/decorators/get-userId.decorator';
import { ApiCreateMentorBoardLike } from '../swagger-decorators/mentorBoard/create-mentor-board-like.decorator';
import { ApiDeleteMentorBoardLike } from '../swagger-decorators/mentorBoard/delete-mentor-board-like.decorator';
import { ParsePositiveIntPipe } from '@src/common/pipes/parse-positive-int.pipe';
import { AccessTokenAuthGuard } from '@src/auth/jwt/jwt-auth.guard';

@ApiTags('mentor-board-like')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@UseInterceptors(SuccessResponseInterceptor, ClassSerializerInterceptor)
@Controller('mentor-boards/:mentorBoardId')
export class MentorBoardLikeController {
  constructor(
    private readonly mentorBoardSLikeService: MentorBoardLikeService,
  ) {}

  @ApiCreateMentorBoardLike()
  @UseGuards(AccessTokenAuthGuard)
  @Post('likes')
  async createMentorBoardLike(
    @GetUserId() userId: number,
    @Param('mentorBoardId', ParsePositiveIntPipe) mentorBoardId: number,
  ): Promise<{ isLike: true }> {
    await this.mentorBoardSLikeService.createMentorBoardLikeAndHotPost(
      mentorBoardId,
      userId,
    );
    return { isLike: true };
  }

  @ApiDeleteMentorBoardLike()
  @UseGuards(AccessTokenAuthGuard)
  @Delete('likes')
  deleteMentorBoardLike(
    @GetUserId() userId: number,
    @Param('mentorBoardId', ParsePositiveIntPipe) mentorBoardId: number,
  ): Promise<{ isLike: false }> {
    return this.mentorBoardSLikeService.deleteMentorBoardLike(
      mentorBoardId,
      userId,
    );
  }
}
