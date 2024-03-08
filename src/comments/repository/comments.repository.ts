import { Injectable } from '@nestjs/common';
import { HelpYouComment } from '@src/comments/entities/help-you-comment.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class CommentsRepository {
  constructor(private readonly entityManager: EntityManager) {}

  createComment(
    userId: number,
    helpMeBoardId: number,
  ): Promise<HelpYouComment> {
    const helpYouComment = this.entityManager
      .getRepository(HelpYouComment)
      .create({ userId, helpMeBoardId });

    return this.entityManager.save(HelpYouComment, helpYouComment);
  }

  // async findCommentsByBoardId(boardId: number): Promise<HelpYouComment[]> {
  //   const query = this.entityManager
  //     .createQueryBuilder(HelpYouComment, 'comment')
  //     .innerJoinAndSelect('comment.user', 'user')
  //     .leftJoinAndSelect('user.userImage', 'userImage')
  //     .where('comment.helpMeBoardId = :boardId', { boardId });
  //   return query.getMany();
  // }

  async findCommentsByBoardId(boardId: number): Promise<HelpYouComment[]> {
    return await this.entityManager.find(HelpYouComment, {
      relations: ['user', 'user.userImage'],
      where: { helpMeBoardId: boardId },
    });
  }

  findOneCommentByUserId(
    userId: number,
    helpMeBoardId: number,
  ): Promise<HelpYouComment> {
    return this.entityManager.findOne(HelpYouComment, {
      where: { userId, helpMeBoardId },
    });
  }

  isExistComment(userId: number, helpMeBoardId: number): Promise<boolean> {
    return this.entityManager
      .getRepository(HelpYouComment)
      .existsBy({ userId, helpMeBoardId });
  }

  async findOneComment(id: number): Promise<HelpYouComment> {
    return await this.entityManager.findOne(HelpYouComment, {
      relations: ['user', 'user.userImage'],
      where: { id },
    });
  }

  async deleteComment(comment: HelpYouComment): Promise<void> {
    await this.entityManager.remove(HelpYouComment, comment);
  }

  // **이부분은 디자인팀의 요청에 의해 쓰이지 않는 API입니다(논의중)**
  // async updateComment(
  //   id: number,
  //   commentData: Partial<CreateCommentDto>,
  // ): Promise<HelpYouComment> {
  //   const existingComment = await this.entityManager.findOne(HelpYouComment, {
  //     relations: ['user', 'user.userImage'],
  //     where: { id },
  //   });
  //   for (const key in commentData) {
  //     if (commentData.hasOwnProperty(key)) {
  //       existingComment[key] = commentData[key];
  //     }
  //   }
  //   await this.entityManager.save(HelpYouComment, existingComment);
  //   return existingComment;
  // }
}
