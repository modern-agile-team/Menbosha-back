import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateHelpMeBoardDto } from '../dto/helpMeBoard/create.help.me.board.dto';
import { HelpMeBoard } from '../entities/help-me-board.entity';
import { UpdateHelpMeBoardDto } from '../dto/helpMeBoard/update.help.me.board.dto';

@Injectable()
export class HelpMeBoardRepository {
  constructor(private readonly entityManager: EntityManager) {}

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

  async pullingUpHelpMeBoards() {
    return await this.helpMeBoardRepository.findLatestPost();
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
