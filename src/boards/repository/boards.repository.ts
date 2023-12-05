import { EntityManager } from 'typeorm';
// import { Board } from '../entities/mentor-board.entity';
import { MentorBoard } from '../entities/mentor-board.entity';
import { CreateBoardDto } from '../dto/create.board.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async createBoard(
    boardData: CreateBoardDto,
    userId: number,
  ): Promise<MentorBoard> {
    const board = new MentorBoard();
    board.head = boardData.head;
    board.body = boardData.body;
    board.userId = userId;
    return await this.entityManager.save(MentorBoard, board);
  }

  async findTotalBoards(): Promise<number> {
    return this.entityManager.count(MentorBoard);
  }

  async findPagedBoards(skip: number, limit: number): Promise<MentorBoard[]> {
    return await this.entityManager.find(MentorBoard, {
      relations: ['user', 'user.userImage', 'boardImages'],
      skip: skip,
      take: limit,
    });
  }

  async findBoardById(id: number): Promise<MentorBoard> {
    return await this.entityManager.findOne(MentorBoard, {
      relations: ['user', 'user.userImage', 'boardImages'],
      where: { id },
    });
  }

  async updateBoard(
    id: number,
    boardData: Partial<CreateBoardDto>,
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
