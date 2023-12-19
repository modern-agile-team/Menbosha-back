import { Injectable } from '@nestjs/common';
import { HelpMeBoardRepository } from '../repository/help.me.board.repository';
import { oneHelpMeBoardResponseDTO } from '../dto/helpMeBoard/one.response.help.me.board.dto';
import { CreateHelpMeBoardDto } from '../dto/helpMeBoard/creare.help.me.board.dto';
import { HelpMeBoard } from '../entities/help-me-board.entity';
import { PageByHelpMeBoardResponseDTO } from '../dto/helpMeBoard/response.help.me.board.dto';

@Injectable()
export class HelpMeBoardService {
  constructor(private helpMeBoardRepository: HelpMeBoardRepository) {}
  async create(
    boardData: CreateHelpMeBoardDto,
    userId: number,
  ): Promise<HelpMeBoard> {
    try {
      return await this.helpMeBoardRepository.createBoard(boardData, userId);
    } catch (error) {
      console.log(error);
    }
  }

  async findPagedHelpMeBoards(
    page: number,
    limit: number,
  ): Promise<{ data: PageByHelpMeBoardResponseDTO[]; total: number }> {
    const skip = (page - 1) * limit;
    const take = limit;
    const boards = await this.helpMeBoardRepository.findPageByHelpMeBoards(
      skip,
      take,
    );
    const total = await this.helpMeBoardRepository.findTotalBoards();

    const boardResponse: PageByHelpMeBoardResponseDTO[] = await Promise.all(
      boards.map(async (board) => {
        return {
          id: board.id,
          head: board.head,
          body: board.body.substring(0, 30),
          createdAt: board.createdAt,
          updatedAt: board.updatedAt,
          category: board.categoryId,
          user: {
            name: board.user.name,
            userImage: board.user.userImage ? board.user.userImage : [],
          },
          helpMeBoardImages: board.helpMeBoardImages.map((image) => ({
            id: image.id,
            imageUrl: image.imageUrl,
          })),
        };
      }),
    );

    return { data: boardResponse, total };
  }

  async findOneBoard(
    boardId: number,
    userId: number,
  ): Promise<oneHelpMeBoardResponseDTO> {
    const board = await this.helpMeBoardRepository.findBoardById(boardId);
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
      categoryId: board.categoryId,
      user: {
        name: board.user.name,
        userImage: board.user.userImage ? board.user.userImage : [],
      },
      helpMeBoardImages: board.helpMeBoardImages.map((image) => ({
        id: image.id,
        imageUrl: image.imageUrl,
      })),
      unitowner: unitowner,
    };
  }

  async updateBoard(
    boardId: number,
    boardData: Partial<CreateHelpMeBoardDto>,
  ): Promise<HelpMeBoard | undefined> {
    const existingBoard =
      await this.helpMeBoardRepository.findBoardById(boardId);
    for (const key in boardData) {
      if (boardData.hasOwnProperty(key)) {
        existingBoard[key] = boardData[key];
      }
    }
    const updatedBoard = await this.helpMeBoardRepository.updateHelpMeBoard(
      boardId,
      existingBoard,
    );
    return updatedBoard;
  }

  async deleteBoard(boardId: number, userId: number): Promise<void> {
    const board = await this.helpMeBoardRepository.findBoardById(boardId);

    if (!board) {
      throw new Error('존재하지 않는 게시물입니다.');
    }

    if (board.userId !== userId) {
      throw new Error('작성한 게시물이 아닙니다.');
    }

    await this.helpMeBoardRepository.deleteBoard(board);
  }
}
