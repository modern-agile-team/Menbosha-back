import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentsRepository } from '../repository/comments.repository';
import { CreateCommentDto } from '../dto/create-comment-dto';
import { CommentResponseDTO } from '../dto/get-all-comment-dto';
// import { UpdateCommentDto } from '../dto/update-comment-dto';

@Injectable()
export class CommentsService {
  constructor(private commentRepository: CommentsRepository) {}

  async create(
    commentData: CreateCommentDto,
    userId: number,
    boardId: number,
  ): Promise<CreateCommentDto> {
    const myComment = await this.commentRepository.findCommentByUserId(
      userId,
      boardId,
    );

    if (myComment) {
      throw new ConflictException('이미 게시물에 댓글을 작성했습니다.');
    }
    return await this.commentRepository.createComment(
      commentData,
      userId,
      boardId,
    );
  }

  async findAllComments(
    boardId: number,
    userId: number,
  ): Promise<{ data: CommentResponseDTO[] }> {
    const comments =
      await this.commentRepository.findCommentsByBoardId(boardId);
    const commentsResponse: CommentResponseDTO[] = await Promise.all(
      comments.map(async (comment) => {
        return {
          id: comment.id,
          content: comment.content,
          commentOwner: comment.userId === userId,
          user: {
            name: comment.user.name,
            userId: comment.user.id,
            rank: comment.user.rank,
            categoryId: comment.user.activityCategoryId,
            imageUrl: comment.user.userImage.imageUrl,
          },
        };
      }),
    );

    return { data: commentsResponse };
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
