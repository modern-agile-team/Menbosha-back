import { Injectable } from '@nestjs/common';
import { HelpMeBoardImage } from 'src/boards/entities/help-me-board-image.entity';
import { HelpMeBoard } from 'src/boards/entities/help-me-board.entity';
import { MentorBoard } from 'src/boards/entities/mentor-board.entity';
import { CategoryList } from 'src/common/entity/category-list.entity';
import { UserImage } from 'src/users/entities/user-image.entity';
import { User } from 'src/users/entities/user.entity';
import { EntityManager } from 'typeorm';

/**
 * @todo 나중에 setParameter, forEach를 통해서 코드를 간소화 할 수 있을 것 같음
 */
@Injectable()
export class SearchRepository {
  constructor(private entityManager: EntityManager) {}
  async searchAllHelpMeBoardsForCount(searchQuery: string, take: number) {
    const helpMeBoardsCount = Promise.all([
      await this.entityManager
        .getRepository(HelpMeBoard)
        .createQueryBuilder('helpMeBoard')
        .innerJoin('helpMeBoard.user', 'user', 'user.id = helpMeBoard.userId')
        .innerJoin('user.userImage', 'userImage')
        .leftJoin('helpMeBoard.helpMeBoardImages', 'helpMeBoardImages')
        .innerJoin('helpMeBoard.categoryList', 'categoryList')
        .select([
          'helpMeBoard.id',
          'helpMeBoard.head',
          'helpMeBoard.body',
          'helpMeBoard.createdAt',
          'helpMeBoardImages.id',
          'helpMeBoardImages.imageUrl',
          'user.id',
          'user.name',
          'userImage.imageUrl',
          'categoryList.categoryName',
        ])
        .where(`MATCH(head) AGAINST (:searchQuery IN BOOLEAN MODE)`, {
          searchQuery,
        })
        .orWhere(`MATCH(body) AGAINST (:searchQuery IN BOOLEAN MODE)`, {
          searchQuery,
        })
        .orWhere(`MATCH(user.name) AGAINST (:searchQuery IN BOOLEAN MODE)`, {
          searchQuery,
        })
        .skip(0)
        .take(take)
        .getCount(),
      await this.entityManager
        .getRepository(User)
        .createQueryBuilder('user')
        .innerJoin('user.userImage', 'userImage'),
    ]);
  }

  async searchBoardsByHead(
    category: string,
    searchQuery: string,
    skip: number,
    take: number,
  ) {
    const boardRepository = this.entityManager.getRepository(HelpMeBoard);

    if (category === '전체') {
      return boardRepository
        .createQueryBuilder('board')
        .where(`MATCH(head) AGAINST (:searchQuery IN BOOLEAN MODE)`, {
          searchQuery,
        })
        .leftJoinAndMapMany(
          'board.user',
          User,
          'user',
          'user.id = board.userId',
        )
        .leftJoinAndSelect('user.userImage', 'userImage')
        .leftJoinAndMapMany(
          'board.boardImages',
          HelpMeBoardImage,
          'boardImages',
          'boardImages.boardId = board.id',
        )
        .select([
          'board.id',
          'board.head',
          'board.body',
          'board.createAt',
          'board.updateAt',
          'user.name',
          'userImage.id',
          'userImage.userId',
          'userImage.imageUrl',
          'boardImages.id',
          'boardImages.imageUrl',
        ])
        .skip(skip)
        .take(take)
        .getManyAndCount();
    }
    return boardRepository
      .createQueryBuilder('board')
      .where(`MATCH(head) AGAINST (:searchQuery IN BOOLEAN MODE)`, {
        searchQuery,
      })
      .andWhere('board.main_category = :category', { category })
      .leftJoinAndMapMany('board.user', User, 'user', 'user.id = board.userId')
      .leftJoinAndSelect('user.userImage', 'userImage')
      .leftJoinAndMapMany(
        'board.boardImages',
        HelpMeBoardImage,
        'boardImages',
        'boardImages.boardId = board.id',
      )
      .select([
        'board.id',
        'board.head',
        'board.body',
        'board.createAt',
        'board.updateAt',
        'user.name',
        'userImage.id',
        'userImage.userId',
        'userImage.imageUrl',
        'boardImages.id',
        'boardImages.imageUrl',
      ])
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async searchBoardsByBody(
    category: string,
    searchQuery: string,
    skip: number,
    take: number,
  ) {
    const boardRepository = this.entityManager.getRepository(HelpMeBoard);

    if (category === '전체') {
      return boardRepository
        .createQueryBuilder('board')
        .where(`MATCH(body) AGAINST (:searchQuery IN BOOLEAN MODE)`, {
          searchQuery,
        })
        .leftJoinAndMapMany(
          'board.user',
          User,
          'user',
          'user.id = board.userId',
        )
        .leftJoinAndSelect('user.userImage', 'userImage')
        .leftJoinAndMapMany(
          'board.boardImages',
          HelpMeBoardImage,
          'boardImages',
          'boardImages.boardId = board.id',
        )
        .select([
          'board.id',
          'board.head',
          'board.body',
          'board.createAt',
          'board.updateAt',
          'user.name',
          'userImage.id',
          'userImage.userId',
          'userImage.imageUrl',
          'boardImages.id',
          'boardImages.imageUrl',
        ])
        .skip(skip)
        .take(take)
        .getManyAndCount();
    }
    return boardRepository
      .createQueryBuilder('board')
      .where(`MATCH(body) AGAINST (:searchQuery IN BOOLEAN MODE)`, {
        searchQuery,
      })
      .andWhere('board.main_category = :category', { category })
      .leftJoinAndMapMany('board.user', User, 'user', 'user.id = board.userId')
      .leftJoinAndSelect('user.userImage', 'userImage')
      .leftJoinAndMapMany(
        'board.boardImages',
        HelpMeBoardImage,
        'boardImages',
        'boardImages.boardId = board.id',
      )
      .select([
        'board.id',
        'board.head',
        'board.body',
        'board.createAt',
        'board.updateAt',
        'user.name',
        'userImage.id',
        'userImage.userId',
        'userImage.imageUrl',
        'boardImages.id',
        'boardImages.imageUrl',
      ])
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async findUserId(searchQuery: string) {
    const returnedUsers = await this.entityManager
      .createQueryBuilder(User, 'user')
      .where(`MATCH(name) AGAINST (:searchQuery IN BOOLEAN MODE)`, {
        searchQuery,
      })
      .select(['user.id'])
      .getMany();

    if (returnedUsers.length) return returnedUsers;
  }

  async searchBoardsByUserName(
    category: string,
    returnedUsers: User[],
    skip: number,
    take: number,
  ) {
    if (category === '전체') {
      return this.entityManager
        .createQueryBuilder(HelpMeBoard, 'board')
        .leftJoinAndMapMany(
          'board.user',
          User,
          'user',
          'user.id = board.userId',
        )
        .leftJoinAndSelect('user.userImage', 'userImage')
        .leftJoinAndMapMany(
          'board.boardImages',
          HelpMeBoardImage,
          'boardImages',
          'boardImages.boardId = board.id',
        )
        .select([
          'board.id',
          'board.head',
          'board.body',
          'board.createAt',
          'board.updateAt',
          'user.name',
          'userImage.id',
          'userImage.userId',
          'userImage.imageUrl',
          'boardImages.id',
          'boardImages.imageUrl',
        ])
        .where('board.userId IN (:...userId)', {
          userId: returnedUsers.map((user) => user.id),
        })
        .skip(skip)
        .take(take)
        .getManyAndCount();
    }

    return this.entityManager
      .createQueryBuilder(HelpMeBoard, 'board')
      .leftJoinAndMapMany('board.user', User, 'user', 'user.id = board.userId')
      .leftJoinAndSelect('user.userImage', 'userImage')
      .leftJoinAndMapMany(
        'board.boardImages',
        HelpMeBoardImage,
        'boardImages',
        'boardImages.boardId = board.id',
      )
      .select([
        'board.id',
        'board.head',
        'board.body',
        'board.createAt',
        'board.updateAt',
        'user.name',
        'userImage.id',
        'userImage.userId',
        'userImage.imageUrl',
        'boardImages.id',
        'boardImages.imageUrl',
      ])
      .where('board.userId IN (:...userId)', {
        userId: returnedUsers.map((user) => user.id),
      })
      .andWhere('board.main_category = :category', { category })
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async searchUsersByName(searchQuery: string) {
    const userRepository = this.entityManager.getRepository(User);

    return userRepository
      .createQueryBuilder()
      .select()
      .where(`MATCH(name) AGAINST (:searchQuery)`, {
        searchQuery,
      })
      .getMany();
  }
}
