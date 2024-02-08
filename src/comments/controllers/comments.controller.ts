import {
  Controller,
  Post,
  Body,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentsService } from '../services/comments.services';
import { CreateCommentDto } from '../dto/create-comment-dto';
import { ApiDeleteComment } from '../swagger-decorators/delete-comment-decorator';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { ApiAddHelpComment } from '../swagger-decorators/post-help-you-comment-decorator';

@Controller('help-you-comments')
@ApiTags('help-you-comment API')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('')
  @UseGuards(JwtAccessTokenGuard)
  @ApiAddHelpComment()
  async createComment(
    @GetUserId() userId: number,
    @Query('helpMeBoardId') boardId: number,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CreateCommentDto> {
    return await this.commentsService.create(createCommentDto, userId, boardId);
  }

  @Delete('')
  @UseGuards(JwtAccessTokenGuard)
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
