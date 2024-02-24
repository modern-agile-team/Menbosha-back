import { Injectable } from '@nestjs/common';
import { HelpMeBoardImage } from '@src/boards/entities/help-me-board-image.entity';
import { HelpMeBoard } from '@src/boards/entities/help-me-board.entity';
import { User } from '@src/users/entities/user.entity';
import { EntityManager } from 'typeorm';
import { SearchAllHelpMeBoardDto } from '../dtos/search-all-help-me-board.dto';
import { SearchAllMentorDto } from '../dtos/search-all-mentor.dto';

/**
 * @todo 나중에 setParameter, forEach를 통해서 코드를 간소화 할 수 있을 것 같음
 */
@Injectable()
export class SearchRepository {
  constructor(private entityManager: EntityManager) {}
  searchAllBoardsAndMentorsCount(searchQuery: string): Promise<number[]> {
    return Promise.all([
      this.entityManager
        .getRepository(HelpMeBoard)
        .createQueryBuilder('helpMeBoard')
        .innerJoin('helpMeBoard.user', 'user', 'user.id = helpMeBoard.userId')
        .where(`MATCH(head) AGAINST (:searchQuery IN BOOLEAN MODE)`, {
          searchQuery,
        })
        .orWhere(`MATCH(body) AGAINST (:searchQuery IN BOOLEAN MODE)`, {
          searchQuery,
        })
        .orWhere(`MATCH(user.name) AGAINST (:searchQuery IN BOOLEAN MODE)`, {
          searchQuery,
        })
        .getCount(),

      this.entityManager
        .getRepository(User)
        .createQueryBuilder('user')
        .where('MATCH(name) AGAINST (:searchQuery IN BOOLEAN MODE)', {
          searchQuery,
        })
        .andWhere('user.isMentor = true')
        .getCount(),
    ]);
  }

  /**
   * skip, take 사용 시 원치 않는 distinct로 인해 helpMeBoardImages의 로우가 1개만 가져와짐.
   * 근데 helpMeBoardImages의 id를 추가로 select하면 모든 로우를 잘불러옴ㅋㅋ...(난 imageUrl만 받고 싶은데)
   * 그렇다고 offset, limit를 사용하면 로우를 덜 가져옴. (아마도 helpMeBoardImages에서 끌어오는 데이터까지 10개가 들어가서 그렇지 않을까.. 생각중)
   * 일단 기본적으로 limit과 take 차이는 간단히 말하면 take는 IN을 사용함.
   * 처음 날린 쿼리의 결과를 객체로 받아 그 id값으로 다시 한번 10개(IN 사용)의 데이터를 얻어오는 것
   * join사용 시에 limit 사용을 지양하라고 TypeOrm에서 말함.
   * 일단 당장에는 이미지를 1개만 가져오면 돼서 추후에 문제는 없지만 해결 방법을 알아보면 좋을 것 같음.
   * 일단은 offset과 limit을 사용하고 groupBy를 통해 DISTINCT를 날리지 않고 중복을 제거함.
   * subQuery도 시도 해봤는데 어려워서 실패. 다음 기회에
   * https://eight20.tistory.com/69 관련 깃허브 이슈가 달려있는 레퍼런스 링크
   * https://velog.io/@pk3669/NEST-TypeORM-Take%EC%99%80-Limit%EC%9D%98-%EC%B0%A8%EC%9D%B4
   */
  async searchAllBoardsAndMentors(
    searchQuery: string,
    skip: number,
  ): Promise<[SearchAllHelpMeBoardDto[], SearchAllMentorDto[]]> {
    // const subQuery = await this.entityManager
    //   .getRepository(HelpMeBoardImage)
    //   .createQueryBuilder('helpMeBoardImages')
    //   .select(['helpMeBoardImages.id', 'helpMeBoardImages.imageUrl']);
    return Promise.all([
      this.entityManager
        .getRepository(HelpMeBoard)
        .createQueryBuilder('helpMeBoard')
        .innerJoin('helpMeBoard.user', 'user')
        .innerJoin('user.userImage', 'userImage')
        .leftJoin('helpMeBoard.helpMeBoardImages', 'helpMeBoardImages')
        .innerJoin('helpMeBoard.categoryList', 'categoryList')
        .select([
          'helpMeBoard.id',
          'helpMeBoard.head',
          'helpMeBoard.body',
          'helpMeBoard.createdAt',
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
        .groupBy('helpMeBoard.id')
        .offset(skip)
        .limit(10)
        .getMany(),

      this.entityManager
        .getRepository(User)
        .createQueryBuilder('user')
        .innerJoin('user.userImage', 'userImage')
        .leftJoin('user.userIntro', 'userIntro')
        .select([
          'user.id',
          'user.name',
          'user.isMentor',
          'userImage.imageUrl',
          'userIntro.customCategory',
          'userIntro.shortIntro',
        ])
        .where('MATCH(name) AGAINST (:searchQuery IN BOOLEAN MODE)', {
          searchQuery,
        })
        .andWhere('user.isMentor = true')
        .groupBy('user.id')
        .offset(skip)
        .limit(10)
        .getMany(),
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
