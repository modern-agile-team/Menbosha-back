import { EntityManager } from 'typeorm';
import { MentorBoard } from '../entities/mentor-board.entity';
import { CreateMentorBoardDto } from '../dto/create.mentor.board.dto';
import { Injectable } from '@nestjs/common';
import { CreateHelpMeBoardDto } from '../dto/creare.help.me.board.dto';
import { HelpMeBoard } from '../entities/help-me-board.entity';

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

  async findTotalBoards(): Promise<number> {
    return this.entityManager.count(HelpMeBoard);
  }

  async findPagedBoards(skip: number, limit: number): Promise<HelpMeBoard[]> {
    return await this.entityManager.find(HelpMeBoard, {
      relations: ['user', 'user.userImage', 'boardImages'],
      skip: skip,
      take: limit,
    });
  }

  async findBoardById(id: number): Promise<HelpMeBoard> {
    return await this.entityManager.findOne(HelpMeBoard, {
      relations: ['user', 'user.userImage', 'boardImages'],
      where: { id },
    });
  }

  async findHelpMeBoardById(id: number): Promise<HelpMeBoard> {
    return await this.entityManager.findOne(HelpMeBoard, {
      relations: ['user', 'user.userImage'],
      where: { id },
    });
  }

  async updateHelpMeBoard(
    id: number,
    boardData: Partial<CreateMentorBoardDto>,
  ): Promise<MentorBoard> {
    const existingBoard = await this.entityManager.findOne(MentorBoard, {
      relations: ['user', 'user.userImage', 'boardImages'],
      where: { id },
    });
    for (const key in boardData) {
      if (boardData.hasOwnProperty(key)) {
        existingBoard[key] = boardData[key];
      }
    }
    await this.entityManager.save(MentorBoard, existingBoard);
    return existingBoard;
  }

  async deleteBoard(board: MentorBoard): Promise<void> {
    await this.entityManager.remove(MentorBoard, board);
  }
}
