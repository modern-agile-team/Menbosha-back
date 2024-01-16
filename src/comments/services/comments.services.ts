import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../repository/comments.repository';
import { CreateCommentDto } from '../dto/create-comment-dto';
import { HelpYouComment } from '../entities/help-you-comment.entity';
import { CommentResponseDTO } from '../dto/get-all-comment-dto';
// import { UpdateCommentDto } from '../dto/update-comment-dto';

@Injectable()
export class CommentsService {
  constructor(private commentRepository: CommentsRepository) {}

  async create(
    commentData: CreateCommentDto,
    userId: number,
    boardId: number,
  ): Promise<HelpYouComment> {
    return await this.commentRepository.createComment(
      commentData,
      userId,
      boardId,
    );
    //나중에 예외처리 추가하기
  }

  async findAllComments(
    boardId: number,
    userId: number,
  ): Promise<CommentResponseDTO[]> {
    const comments =
      await this.commentRepository.findCommentsByBoardId(boardId);
    if (!comments) {
      return []; // 에러 말고 리턴으로 빈 배열
    }
    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      commentOwner: comment.userId === userId,
      user: {
        name: comment.user.name,
        userId: comment.user.id,
        rank: comment.user.rank,
        categoryId: comment.user.activityCategoryId,
        userImage: comment.user.userImage.imageUrl,
      },
    }));
  }

  // 이부분의 기능은 아직 논의중입니다. (디자인팀 기능삭제)
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

  async deleteComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.commentRepository.findOneComment(commentId);

    if (!comment) {
      throw new Error('존재하지 않는 댓글입니다.');
    }

    if (comment.userId !== userId) {
      throw new Error('작성한 댓글이 아닙니다.');
    }
    await this.commentRepository.deleteComment(comment);
  }
}
