import { EntityManager } from 'typeorm';
import { Board } from '../entities/mentor-board.entity';
import { CreateBoardDto } from '../dto/create.board.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async createBoard(boardData: CreateBoardDto, userId: number): Promise<Board> {
    const board = new Board();
    board.head = boardData.head;
    board.body = boardData.body;
    board.userId = userId;
    return await this.entityManager.save(Board, board);
  }

  async findTotalBoards(): Promise<number> {
    return this.entityManager.count(Board);
  }

  async findPagedBoards(skip: number, limit: number): Promise<Board[]> {
    return await this.entityManager.find(Board, {
      relations: ['user', 'user.userImage', 'boardImages'],
      skip: skip,
      take: limit,
    });
  }

  async findBoardById(id: number): Promise<Board> {
    return await this.entityManager.findOne(Board, {
      relations: ['user', 'user.userImage', 'boardImages'],
      where: { id },
    });
  }

  async updateBoard(
    id: number,
    boardData: Partial<CreateBoardDto>,
  ): Promise<Board> {
    const existingBoard = await this.entityManager.findOne(Board, {
      relations: ['user', 'user.userImage', 'boardImages'],
      where: { id },
    });
    for (const key in boardData) {
      if (boardData.hasOwnProperty(key)) {
        existingBoard[key] = boardData[key];
      }
    }
    await this.entityManager.save(Board, existingBoard);
    return existingBoard;
  }

  async deleteBoard(board: Board): Promise<void> {
    await this.entityManager.remove(Board, board);
  }
}
