import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SuccessResponseInterceptor } from 'src/common/interceptors/success-response.interceptor';
import { MentorBoardLikeService } from '../services/mentor-board-likes.service';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { ApiCreateMentorBoardLike } from '../swagger-decorators/mentorBoard/create-mentor-board-like.decorator';
import { ApiDeleteMentorBoardLike } from '../swagger-decorators/mentorBoard/delete-mentor-board-like.decorator';

@ApiTags('mentor-board-likes')
@UseInterceptors(SuccessResponseInterceptor, ClassSerializerInterceptor)
/**
 * @todo restful하게 uri 수정
 */
@Controller('mentor-board')
export class MentorBoardLikeController {
  constructor(
    private readonly mentorBoardSLikeService: MentorBoardLikeService,
  ) {}

  @ApiCreateMentorBoardLike()
  @UseGuards(JwtAccessTokenGuard)
  @Post(':mentorBoardId/like')
  async createMentorBoardLike(
    @GetUserId() userId: number,
    @Param('mentorBoardId', ParseIntPipe) mentorBoardId: number,
  ): Promise<{ isLike: true }> {
    await this.mentorBoardSLikeService.createMentorBoardLikeAndHotPost(
      mentorBoardId,
      userId,
    );
    return { isLike: true };
  }

  @ApiDeleteMentorBoardLike()
  @UseGuards(JwtAccessTokenGuard)
  @Delete(':mentorBoardId/like')
  deleteMentorBoardLike(
    @GetUserId() userId: number,
    @Param('mentorBoardId', ParseIntPipe) mentorBoardId: number,
  ): Promise<{ isLike: false }> {
    return this.mentorBoardSLikeService.deleteMentorBoardLike(
      mentorBoardId,
      userId,
    );
  }
}
