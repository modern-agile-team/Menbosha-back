import { DeleteResult, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { SortOrder } from '@src/common/constants/sort-order.enum';
import { QueryBuilderHelper } from '@src/helpers/query-builder.helper';
import { HelpYouCommentOrderField } from '@src/comments/constants/help-you-comment-order-field.enum';
import { HelpMeBoardOrderField } from '@src/boards/constants/help-me-board-order-field.enum';
import { CreateHelpMeBoardDto } from '@src/boards/dto/helpMeBoard/create.help.me.board.dto';
import { UpdateHelpMeBoardDto } from '@src/boards/dto/helpMeBoard/update.help.me.board.dto';
import { HelpMeBoard } from '@src/entities/HelpMeBoard';
import { HelpYouComment } from '@src/entities/HelpYouComment';

@Injectable()
export class HelpMeBoardRepository {
  private readonly FULL_TEXT_SEARCH_FIELD: readonly (keyof Pick<
    HelpMeBoard,
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

  findOneHelpMeBoardBy(helpMeBoardId: number) {
    return this.entityManager
      .getRepository(HelpMeBoard)
      .findOneBy({ id: helpMeBoardId });
  }

  async findHelpMeBoardById(id: number): Promise<HelpMeBoard> {
    return await this.entityManager.findOne(HelpMeBoard, {
      relations: ['user', 'user.userImage', 'helpMeBoardImages'],
      where: { id },
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
      loadOnlyPullingUp: boolean;
    },
  ) {
    const queryBuilder = this.entityManager
      .getRepository(HelpMeBoard)
      .createQueryBuilder('helpMeBoard')
      .leftJoin(
        'helpMeBoard.helpMeBoardImages',
        'helpMeBoardImages',
        'helpMeBoardImages.id = (SELECT id FROM help_me_board_image WHERE help_me_board_id = helpMeBoard.id ORDER BY id DESC LIMIT 1)',
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

    this.queryBuilderHelper.buildWherePropForFind(
      queryBuilder,
      filter,
      'helpMeBoard',
      this.FULL_TEXT_SEARCH_FIELD,
    );

    this.queryBuilderHelper.buildOrderByPropForFind(
      queryBuilder,
      'helpMeBoard',
      orderField,
      sortOrder,
    );

    return queryBuilder.skip(skip).take(pageSize).getManyAndCount();
  }

  findAllHelpYouCommentsByQueryBuilder(
    helpMeBoardId: number,
    skip: number,
    pageSize: number,
    orderField: HelpYouCommentOrderField,
    sortOrder: SortOrder,
    filter: {
      id?: number;
      userId?: number;
    },
  ) {
    const queryBuilder = this.entityManager
      .getRepository(HelpYouComment)
      .createQueryBuilder('helpYouComment')
      .innerJoin('helpYouComment.user', 'user')
      .innerJoin('user.userImage', 'userImage')
      .leftJoin('user.userIntro', 'userIntro')
      .select([
        'helpYouComment.id',
        'helpYouComment.userId',
        'helpYouComment.helpMeBoardId',
        'helpYouComment.createdAt',
        'user.name',
        'user.rank',
        'user.activityCategoryId',
        'userImage.imageUrl',
        'userIntro.shortIntro',
        'userIntro.career',
      ])
      .where({ helpMeBoardId });

    this.queryBuilderHelper.buildWherePropForFind(
      queryBuilder,
      filter,
      'helpYouComment',
    );

    this.queryBuilderHelper.buildOrderByPropForFind(
      queryBuilder,
      'helpYouComment',
      orderField,
      sortOrder,
    );

    return queryBuilder.skip(skip).take(pageSize).getManyAndCount();
  }

  async pullingUpHelpMeBoard(board: HelpMeBoard): Promise<void> {
    await this.entityManager.save(board);
  }

  async updateHelpMeBoard(
    boardData: Partial<UpdateHelpMeBoardDto>,
  ): Promise<HelpMeBoard> {
    return await this.entityManager.save(HelpMeBoard, boardData);
  }

  deleteBoard(boardId: number): Promise<DeleteResult> {
    return this.entityManager
      .getRepository(HelpMeBoard)
      .delete({ id: boardId });
  }
}
