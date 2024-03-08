import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HelpMeBoardService } from '@src/boards/services/help.me.board.service';
import { HelpYouCommentDto } from '@src/comments/dto/help-you-comment.dto';
import { CommentsRepository } from '@src/comments/repository/comments.repository';
// import { UpdateCommentDto } from '@src/dto/update-comment-dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentsRepository,
    private readonly helpMeBoardService: HelpMeBoardService,
  ) {}

  async create(userId: number, boardId: number): Promise<HelpYouCommentDto> {
    const existHelpMeBoard =
      await this.helpMeBoardService.findOneOrFail(boardId);

    if (existHelpMeBoard.userId === userId) {
      throw new ForbiddenException(
        '본인의 도와주세요 게시글에는 댓글을 달 수 없습니다.',
      );
    }

    const isExistComment = await this.commentRepository.isExistComment(
      userId,
      existHelpMeBoard.id,
    );

    if (isExistComment) {
      throw new ConflictException('이미 게시물에 댓글을 작성했습니다.');
    }

    const helpYouComment = await this.commentRepository.createComment(
      userId,
      boardId,
    );

    return new HelpYouCommentDto(helpYouComment);
  }

  async deleteComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.commentRepository.findOneComment(commentId);

    if (!comment) {
      throw new NotFoundException('존재하지 않는 댓글입니다.');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('작성한 댓글이 아닙니다.');
    }

    await this.commentRepository.deleteComment(comment);
  }

  // **이부분의 기능은 아직 논의중입니다. (디자인팀 기능삭제)**
  // async updateComment(
  //   commentId: number,
  //   commentData: Partial<UpdateCommentDto>,
  // ): Promise<HelpYouComment | undefined> {
  //   const existingComment =
  //     await this.commentRepository.findOneComment(commentId);
  //   for (const key in commentData) {
  //     if (commentData.hasOwnProperty(key)) {
  //       existingComment[key] = commentData[key];
  //     }
  //   }
  //   const updatedComment = await this.commentRepository.updateComment(
  //     commentId,
  //     existingComment,
  //   );
  //   return updatedComment;
  // }
}
