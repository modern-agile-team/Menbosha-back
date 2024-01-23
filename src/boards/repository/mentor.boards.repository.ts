import {
  EntityManager,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { MentorBoard } from '../entities/mentor-board.entity';
import { CreateMentorBoardDto } from '../dto/mentorBoard/create.mentor.board.dto';
import { Injectable } from '@nestjs/common';
import { UpdateMentorBoardDto } from '../dto/mentorBoard/update.mentor.board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class MentorBoardRepository {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(MentorBoard)
    private readonly mentorBoardRepository: Repository<MentorBoard>,
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

  async findRandomMentorBoardByCategoryId(
    limit: number,
    categoryId: number,
  ): Promise<MentorBoard[]> {
    return this.entityManager
      .createQueryBuilder(MentorBoard, 'board')
      .leftJoinAndSelect('board.user', 'user')
      .leftJoinAndSelect('user.userImage', 'userImage')
      .leftJoinAndSelect('board.mentorBoardImages', 'mentorBoardImages')
      .orderBy('RAND()')
      .where({ categoryId })
      .take(limit)
      .getMany();
  }

  async findRandomMentorBoard(limit: number): Promise<MentorBoard[]> {
    return this.entityManager
      .createQueryBuilder(MentorBoard, 'board')
      .leftJoinAndSelect('board.user', 'user')
      .leftJoinAndSelect('user.userImage', 'userImage')
      .leftJoinAndSelect('board.mentorBoardImages', 'mentorBoardImages')
      .orderBy('RAND()')
      .take(limit)
      .getMany();
  }

  async findTotalBoardsByCategoryId(categoryId: number): Promise<number> {
    return this.entityManager.count(MentorBoard, {
      where: { categoryId: categoryId },
    });
  }

  async findTotalBoards(): Promise<number> {
    return this.entityManager.count(MentorBoard);
  }

  async findPagedBoardsByCategoryId(
    skip: number,
    limit: number,
    categoryId: number,
  ): Promise<MentorBoard[]> {
    return await this.entityManager.find(MentorBoard, {
      relations: ['user', 'user.userImage', 'mentorBoardImages'],
      where: { categoryId },
      skip: skip,
      take: limit,
    });
  }

  async findPagedBoards(skip: number, limit: number): Promise<MentorBoard[]> {
    return await this.entityManager.find(MentorBoard, {
      relations: ['user', 'user.userImage', 'mentorBoardImages'],
      skip: skip,
      take: limit,
    });
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
      .withRepository(this.mentorBoardRepository)
      .update(criteria, partialEntity);
  }

  async deleteBoard(board: MentorBoard): Promise<void> {
    await this.entityManager.remove(MentorBoard, board);
  }
}
