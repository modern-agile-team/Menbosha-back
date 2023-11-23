import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateCommentDto } from '../dto/create-comment-dto';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentsRepository {
  constructor(private readonly entityManager: EntityManager) {}
  async createComment(
    commentData: CreateCommentDto,
    userId: number,
    boardId: number,
  ): Promise<Comment> {
    const comment = new Comment();
    comment.content = commentData.content;
    comment.userId = userId;
    comment.boardId = boardId;
    return await this.entityManager.save(Comment, comment);
  }

  async findCommentsByBoardId(boardId: number): Promise<Comment[]> {
    const query = this.entityManager
      .createQueryBuilder(Comment, 'comment')
      .innerJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.reComment', 'reComment')
      .leftJoinAndSelect('reComment.user', 'reCommentUser')
      .leftJoinAndSelect('reCommentUser.userImage', 'reCommentUserImage')
      .leftJoinAndSelect('user.userImage', 'userImage')
      .where('comment.boardId = :boardId', { boardId });
    return query.getMany();
  }

  async findOneComment(id: number): Promise<Comment> {
    return await this.entityManager.findOne(Comment, {
      relations: ['user', 'user.userImage'],
      where: { id },
    });
  }

  async updateComment(
    id: number,
    commentData: Partial<CreateCommentDto>,
  ): Promise<Comment> {
    const existingComment = await this.entityManager.findOne(Comment, {
      relations: ['user', 'user.userImage'],
      where: { id },
    });
    for (const key in commentData) {
      if (commentData.hasOwnProperty(key)) {
        existingComment[key] = commentData[key];
      }
    }
    await this.entityManager.save(Comment, existingComment);
    return existingComment;
  }

  async deleteComment(comment: Comment): Promise<void> {
    await this.entityManager.remove(Comment, comment);
  }
}
