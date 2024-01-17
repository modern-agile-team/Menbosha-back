import {
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
    return await this.commentRepository.createComment(
      commentData,
      userId,
      boardId,
    );
    // 각 게시글에 멘토는 1개의 도와줄게요 댓글만 남길 수 있음. 이에 대한 예외처리를 POST요청에서 하게된다면
    // 버튼이 있고, 눌렀을 때 이미 게시물에 댓글을 작성했습니다. 라고 떠야함 --> 개인적인 생각으로 비효율적
  }

  async findAllComments(
    boardId: number,
    userId: number,
  ): Promise<{ data: CommentResponseDTO[]; myComment }> {
    const comments =
      await this.commentRepository.findCommentsByBoardId(boardId);
    // if (!comments) {
    //   return []; // 에러 말고 리턴으로 빈 배열
    // }
    // 그렇다면 여기서 예외처리로 myComment라는것에 token의 userId값과 모든 comment의 userId를 받아와서 값을 주면?
    // 여기에 + 예외처리로 userId가 없을 경우도 생각해야함.
    const writeComment = await this.commentRepository.findCommentByUserId(
      userId,
      boardId,
    );
    const myComment = writeComment.userId === userId;
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
            userImage: comment.user.userImage.imageUrl,
          },
        };
      }),
    );

    return { data: commentsResponse, myComment };
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
