import { Controller, Post, Query, Delete, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUserId } from '@src/common/decorators/get-userId.decorator';
import { AccessTokenAuthGuard } from '@src/auth/jwt/jwt-auth.guard';
import { CommentsService } from '@src/comments/services/comments.services';
import { ApiDeleteComment } from '@src/comments/swagger-decorators/delete-comment-decorator';
import { ApiAddHelpComment } from '@src/comments/swagger-decorators/post-help-you-comment-decorator';
import { HelpYouComment } from '@src/entities/HelpYouComment';

@Controller('help-you-comments')
@ApiTags('help-you-comment API')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('')
  @UseGuards(AccessTokenAuthGuard)
  @ApiAddHelpComment()
  async createComment(
    @GetUserId() userId: number,
    @Query('helpMeBoardId') boardId: number,
  ): Promise<HelpYouComment> {
    return await this.commentsService.create(userId, boardId);
  }

  @Delete('')
  @UseGuards(AccessTokenAuthGuard)
  @ApiDeleteComment()
  async deleteComment(
    @Query('commentId') commentId: number,
    @GetUserId() userId: number,
  ) {
    await this.commentsService.deleteComment(commentId, userId);
  }

  // ** 이부분의 기능들은 디자인팀 요청에 의해 아직 보류중입니다. **
  // @Patch('')
  // @ApiUpdateComment()
  // async updateComment(
  //   @Query('helpYouCommentId') commentId: number,
  //   @Body() commentData: Partial<HelpYouComment>,
  // ): Promise<HelpYouComment> {
  //   return this.commentsService.updateComment(commentId, commentData);
  // }
}
