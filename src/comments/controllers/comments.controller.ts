import {
  Controller,
  Post,
  Body,
  Query,
  Get,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { HelpYouComment } from '../entities/help-you-comment.entity';
import { ApiTags } from '@nestjs/swagger';
import { CommentsService } from '../services/comments.services';
import { CreateCommentDto } from '../dto/create-comment-dto';
import { ApiAddComment } from '../swagger-decorators/add-comment-decorators';
import { ApiGetAllComment } from '../swagger-decorators/get-all-comment-decorators';
import { CommentResponseDTO } from '../dto/get-all-comment-dto';
import { ApiUpdateComment } from '../swagger-decorators/patch-comment-decorators';
import { ApiDeleteComment } from '../swagger-decorators/delete-comment-decorator';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { JwtOptionalGuard } from 'src/config/guards/jwt-optional.guard';

@Controller('comments')
@ApiTags('Comment API')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('')
  @UseGuards(JwtAccessTokenGuard)
  @ApiAddComment()
  async createComment(
    @GetUserId() userId: number,
    @Query('boardId') boardId: number,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<HelpYouComment> {
    return await this.commentsService.create(createCommentDto, userId, boardId);
  }

  @Get('')
  @UseGuards(JwtOptionalGuard)
  @ApiGetAllComment()
  async getComment(
    @GetUserId() userId: number,
    @Query('boardId') boardId: number,
  ): Promise<CommentResponseDTO[]> {
    return this.commentsService.findAllComments(boardId, userId);
  }

  @Patch('')
  @ApiUpdateComment()
  async updateComment(
    @Query('commentId') commentId: number,
    @Body() commentData: Partial<HelpYouComment>,
  ): Promise<HelpYouComment> {
    return this.commentsService.updateComment(commentId, commentData);
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
}
