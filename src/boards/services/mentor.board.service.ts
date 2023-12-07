import { Injectable } from '@nestjs/common';
import { MentorBoardRepository } from '../repository/mentor.boards.repository';
import { CreateMentorBoardDto } from '../dto/create.mentor.board.dto';
import { MentorBoard } from '../entities/mentor-board.entity';
import { BoardResponseDTO } from '../dto/boards.response.dto';
import { oneBoardResponseDTO } from '../dto/boards.one.response.dto';

@Injectable()
export class MentorBoardsService {
  constructor(private mentorBoardRepository: MentorBoardRepository) {}
  async create(
    boardData: CreateMentorBoardDto,
    userId: number,
  ): Promise<MentorBoard> {
    try {
      return await this.mentorBoardRepository.createBoard(boardData, userId);
    } catch (error) {
      console.log(error);
    }
  }

  async findPagedBoards(
    page: number,
    limit: number,
  ): Promise<{ data: BoardResponseDTO[]; total: number }> {
    const skip = (page - 1) * limit;
    const take = limit;
    const boards = await this.mentorBoardRepository.findPagedBoards(skip, take);
    const total = await this.mentorBoardRepository.findTotalBoards();

    const boardResponse: BoardResponseDTO[] = await Promise.all(
      boards.map(async (board) => {
        return {
          id: board.id,
          head: board.head,
          body: board.body.substring(0, 30),
          createdAt: board.createdAt,
          updatedAt: board.updatedAt,
          userId: {
            name: board.user.name,
            userImage: board.user.userImage ? board.user.userImage : [],
          },
        };
      }),
    );

    return { data: boardResponse, total };
  }

  async findOneBoard(
    boardId: number,
    userId: number,
  ): Promise<oneBoardResponseDTO> {
    const board = await this.mentorBoardRepository.findBoardById(boardId);
    const unitowner = board.userId === userId;
    if (!board) {
      throw new Error('게시물을 찾을 수 없습니다.');
    }
    return {
      id: board.id,
      head: board.head,
      body: board.body,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
      userId: {
        name: board.user.name,
        userImage: board.user.userImage ? board.user.userImage : [],
      },
      unitowner: unitowner,
    };
  }

  async updateMentorBoard(
    boardId: number,
    boardData: Partial<CreateMentorBoardDto>,
  ): Promise<MentorBoard | undefined> {
    const existingBoard =
      await this.mentorBoardRepository.findBoardById(boardId);
    for (const key in boardData) {
      if (boardData.hasOwnProperty(key)) {
        existingBoard[key] = boardData[key];
      }
    }
    const updatedBoard = await this.mentorBoardRepository.updateBoard(
      boardId,
      existingBoard,
    );
    return updatedBoard;
  }

  async deleteBoard(boardId: number, userId: number): Promise<void> {
    const board = await this.mentorBoardRepository.findBoardById(boardId);

    if (!board) {
      throw new Error('존재하지 않는 게시물입니다.');
    }

    if (board.userId !== userId) {
      throw new Error('작성한 게시물이 아닙니다.');
    }

    await this.mentorBoardRepository.deleteBoard(board);
  }
}
