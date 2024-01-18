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
    // 이부분 return 나중에 dto로 변경하기
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

  async findCommentByUserId(
    userId: number,
    boardId: number,
  ): Promise<HelpYouComment> {
    return await this.entityManager.findOne(HelpYouComment, {
      where: { userId: userId, helpMeBoardId: boardId },
    });
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
