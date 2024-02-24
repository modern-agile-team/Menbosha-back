import {
  EntityManager,
  FindOneOptions,
  FindOptionsWhere,
  UpdateResult,
} from 'typeorm';
import { MentorBoard } from '../entities/mentor-board.entity';
import { CreateMentorBoardDto } from '../dto/mentorBoard/create.mentor.board.dto';
import { Injectable } from '@nestjs/common';
import { UpdateMentorBoardDto } from '../dto/mentorBoard/update.mentor.board.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { QueryBuilderHelper } from '@src/helpers/query-builder.helper';
import { SortOrder } from '@src/common/constants/sort-order.enum';
import { MentorBoardOrderField } from '../constants/mentor-board-order-field.enum';
import { MentorBoardDto } from '../dto/mentorBoard/mentor-board.dto';

@Injectable()
export class MentorBoardRepository {
  private readonly FULL_TEXT_SEARCH_FIELD: readonly (keyof Pick<
    MentorBoardDto,
    'head' | 'body'
  >)[] = ['head', 'body'];

  constructor(
    private readonly entityManager: EntityManager,
    private readonly queryBuilderHelper: QueryBuilderHelper,
  ) {}

  async createBoard(
    boardData: CreateMentorBoardDto,
    userId: number,
  ): Promise<MentorBoard> {
    const mentorBoard = new MentorBoard();
    mentorBoard.head = boardData.head;
    mentorBoard.body = boardData.body;
    mentorBoard.categoryId = boardData.categoryId;
    mentorBoard.userId = userId;
    return await this.entityManager.save(MentorBoard, mentorBoard);
    //이 부분 return은 dto로 수정하기
  }

  async findTotalBoardsByCategoryId(categoryId: number): Promise<number> {
    return this.entityManager.count(MentorBoard, {
      where: { categoryId: categoryId },
    });
  }

  async findTotalBoards(): Promise<number> {
    return this.entityManager.count(MentorBoard);
  }

  findAllMentorBoardsByQueryBuilder(
    skip: number,
    pageSize: number,
    orderField: MentorBoardOrderField,
    sortOrder: SortOrder,
    filter: {
      id?: number;
      userId?: number;
      head?: string;
      body?: string;
      categoryId: number;
      loadOnlyPopular: boolean;
    },
  ) {
    const queryBuilder = this.entityManager
      .getRepository(MentorBoard)
      .createQueryBuilder('mentorBoard')
      .leftJoin(
        'mentorBoard.mentorBoardImages',
        'mentorBoardImages',
        'mentorBoardImages.id = (SELECT id FROM mentor_board_image WHERE mentor_board_id = mentorBoard.id ORDER BY id DESC LIMIT 1)',
      )
      .leftJoin('mentorBoard.mentorBoardLikes', 'mentorBoardLikes')
      .innerJoin('mentorBoard.user', 'user')
      .innerJoin('user.userImage', 'userImage')
      .select([
        'mentorBoard.id',
        'mentorBoard.userId',
        'mentorBoard.head',
        'mentorBoard.body',
        'mentorBoard.categoryId',
        'mentorBoard.createdAt',
        'mentorBoard.updatedAt',
        'mentorBoard.popularAt',
        'user.name',
        'userImage.imageUrl',
        'mentorBoardLikes.id',
        'mentorBoardLikes.userId',
        'mentorBoardImages.id',
        'mentorBoardImages.imageUrl',
      ]);

    this.queryBuilderHelper.buildWherePropForFind(
      queryBuilder,
      filter,
      'mentorBoard',
      this.FULL_TEXT_SEARCH_FIELD,
    );

    this.queryBuilderHelper.buildOrderByPropForFind(
      queryBuilder,
      'mentorBoard',
      orderField,
      sortOrder,
    );

    return queryBuilder.skip(skip).take(pageSize).getManyAndCount();
  }

  findOneMentorBoard(options: FindOneOptions<MentorBoard>) {
    return this.entityManager.getRepository(MentorBoard).findOne(options);
  }

  async findMentorBoardById(id: number): Promise<MentorBoard> {
    return await this.entityManager.findOne(MentorBoard, {
      relations: ['user', 'user.userImage', 'mentorBoardImages'],
      where: { id },
    });
  }

  async updateMentorBoard(
    boardData: Partial<UpdateMentorBoardDto>,
  ): Promise<MentorBoard> {
    return await this.entityManager.save(MentorBoard, boardData);
  }

  updateMentorBoardWithEntityManager(
    entityManager: EntityManager,
    criteria: FindOptionsWhere<MentorBoard>,
    partialEntity: QueryDeepPartialEntity<MentorBoard>,
  ): Promise<UpdateResult> {
    return entityManager
      .getRepository(MentorBoard)
      .update(criteria, partialEntity);
  }

  async deleteBoard(board: MentorBoard): Promise<void> {
    await this.entityManager.remove(MentorBoard, board);
  }
}
