import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateHelpMeBoardDto } from '../dto/helpMeBoard/create.help.me.board.dto';
import { HelpMeBoard } from '../entities/help-me-board.entity';
import { UpdateHelpMeBoardDto } from '../dto/helpMeBoard/update.help.me.board.dto';
import { HelpMeBoardOrderField } from '../constants/help-me-board-order-field.enum';
import { SortOrder } from 'src/common/constants/sort-order.enum';
import { QueryBuilderHelper } from 'src/helpers/query-builder.helper';
import { HelpMeBoardDto } from '../dto/helpMeBoard/help-me-board.dto';

@Injectable()
export class HelpMeBoardRepository {
  private readonly FULL_TEXT_SEARCH_FIELD: readonly (keyof Pick<
    HelpMeBoardDto,
    'head' | 'body'
  >)[] = ['head', 'body'];

  constructor(
    private readonly entityManager: EntityManager,
    private readonly queryBuilderHelper: QueryBuilderHelper,
  ) {}

  async createBoard(
    boardData: CreateHelpMeBoardDto,
    userId: number,
  ): Promise<HelpMeBoard> {
    const helpMeBoard = new HelpMeBoard();
    helpMeBoard.head = boardData.head;
    helpMeBoard.body = boardData.body;
    helpMeBoard.categoryId = boardData.categoryId;
    helpMeBoard.userId = userId;
    return await this.entityManager.save(HelpMeBoard, helpMeBoard); //이 부분 return은 dto로 수정하기
  }

  async findTotalBoardsByCategoryId(categoryId: number): Promise<number> {
    return this.entityManager.count(HelpMeBoard, {
      where: { categoryId: categoryId },
    });
  }

  async findTotalBoards(): Promise<number> {
    return this.entityManager.count(HelpMeBoard);
  }

  async findPagedBoardsByCategoryId(
    skip: number,
    limit: number,
    categoryId: number,
  ): Promise<HelpMeBoard[]> {
    return await this.entityManager.find(HelpMeBoard, {
      relations: ['user', 'user.userImage', 'helpMeBoardImages'],
      where: { categoryId },
      skip: skip,
      take: limit,
    });
  }

  async findPageByHelpMeBoards(
    skip: number,
    limit: number,
  ): Promise<HelpMeBoard[]> {
    return await this.entityManager.find(HelpMeBoard, {
      relations: ['user', 'user.userImage', 'helpMeBoardImages'],
      skip: skip,
      take: limit,
    });
  }

  async findHelpMeBoardById(id: number): Promise<HelpMeBoard> {
    return await this.entityManager.findOne(HelpMeBoard, {
      relations: ['user', 'user.userImage', 'helpMeBoardImages'],
      where: { id },
    });
  }

  async findLatestBoardsByCategoryId(
    limit: number,
    categoryId: number,
  ): Promise<HelpMeBoard[]> {
    return await this.entityManager.find(HelpMeBoard, {
      relations: ['user', 'user.userImage', 'helpMeBoardImages'],
      where: { categoryId: categoryId },
      order: { pullingUp: 'DESC' },
      take: limit,
    });
  }

  async findLatestBoards(limit: number): Promise<HelpMeBoard[]> {
    return await this.entityManager.find(HelpMeBoard, {
      relations: ['user', 'user.userImage', 'helpMeBoardImages'],
      order: { pullingUp: 'DESC' },
      take: limit,
    });
  }

  findAllHelpMeBoardsByQueryBuilder(
    skip: number,
    pageSize: number,
    orderField: HelpMeBoardOrderField,
    sortOrder: SortOrder,
    filter: {
      id?: number;
      userId?: number;
      head?: string;
      body?: string;
      categoryId: number;
    },
  ) {
    const queryBuilder = this.entityManager
      .getRepository(HelpMeBoard)
      .createQueryBuilder('helpMeBoard')
      .leftJoin(
        'helpMeBoard.helpMeBoardImages',
        'helpMeBoardImages',
        'helpMeBoardImages.id = (SELECT id FROM help_me_board_image WHERE mentor_board_id = mentorBoard.id ORDER BY id DESC LIMIT 1)',
      )
      .innerJoin('helpMeBoard.user', 'user')
      .innerJoin('user.userImage', 'userImage')
      .select([
        'helpMeBoard.id',
        'helpMeBoard.userId',
        'helpMeBoard.head',
        'helpMeBoard.body',
        'helpMeBoard.categoryId',
        'helpMeBoard.createdAt',
        'helpMeBoard.updatedAt',
        'helpMeBoard.pullingUp',
        'user.name',
        'userImage.imageUrl',
        'helpMeBoardImages.id',
        'helpMeBoardImages.imageUrl',
      ]);

    this.queryBuilderHelper.buildWherePropForBoardFind(
      queryBuilder,
      filter,
      'helpMeBoard',
      this.FULL_TEXT_SEARCH_FIELD,
    );

    this.queryBuilderHelper.buildOrderByPropForBoardFind(
      queryBuilder,
      'helpMeBoard',
      orderField,
      sortOrder,
    );

    return queryBuilder.skip(skip).take(pageSize).getMany();
  }

  async pullingUpHelpMeBoard(board: HelpMeBoard): Promise<void> {
    await this.entityManager.save(board);
  }

  async updateHelpMeBoard(
    boardData: Partial<UpdateHelpMeBoardDto>,
  ): Promise<HelpMeBoard> {
    return await this.entityManager.save(HelpMeBoard, boardData);
  }

  async deleteBoard(board: HelpMeBoard): Promise<void> {
    await this.entityManager.remove(HelpMeBoard, board);
  }
}
