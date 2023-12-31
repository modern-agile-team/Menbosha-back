import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateCommentDto } from '../dto/create-comment-dto';
import { HelpYouComment } from '../entities/help-you-comment.entity';

@Injectable()
export class CommentsRepository {
  constructor(private readonly entityManager: EntityManager) {}
  async createComment(
    commentData: CreateCommentDto,
    userId: number,
    boardId: number,
  ): Promise<HelpYouComment> {
    const comment = new HelpYouComment();
    comment.content = commentData.content;
    comment.userId = userId;
    comment.helpMeBoardId = boardId;
    return await this.entityManager.save(HelpYouComment, comment);
  }

  async findCommentsByBoardId(boardId: number): Promise<HelpYouComment[]> {
    const query = this.entityManager
      .createQueryBuilder(HelpYouComment, 'comment')
      .innerJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.reComment', 'reComment')
      .leftJoinAndSelect('reComment.user', 'reCommentUser')
      .leftJoinAndSelect('reCommentUser.userImage', 'reCommentUserImage')
      .leftJoinAndSelect('user.userImage', 'userImage')
      .where('comment.boardId = :boardId', { boardId });
    return query.getMany();
  }

  async findOneComment(id: number): Promise<HelpYouComment> {
    return await this.entityManager.findOne(HelpYouComment, {
      relations: ['user', 'user.userImage'],
      where: { id },
    });
  }

  async updateComment(
    id: number,
    commentData: Partial<CreateCommentDto>,
  ): Promise<HelpYouComment> {
    const existingComment = await this.entityManager.findOne(HelpYouComment, {
      relations: ['user', 'user.userImage'],
      where: { id },
    });
    for (const key in commentData) {
      if (commentData.hasOwnProperty(key)) {
        existingComment[key] = commentData[key];
      }
    }
    await this.entityManager.save(HelpYouComment, existingComment);
    return existingComment;
  }

  async deleteComment(comment: HelpYouComment): Promise<void> {
    await this.entityManager.remove(HelpYouComment, comment);
  }
}
