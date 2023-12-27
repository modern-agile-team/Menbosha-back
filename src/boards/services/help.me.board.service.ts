import { Injectable } from '@nestjs/common';
import { HelpMeBoardRepository } from '../repository/help.me.board.repository';
import { oneHelpMeBoardResponseDTO } from '../dto/helpMeBoard/one.response.help.me.board.dto';
import { CreateHelpMeBoardDto } from '../dto/helpMeBoard/create.help.me.board.dto';
import { HelpMeBoard } from '../entities/help-me-board.entity';
import { PageByHelpMeBoardResponseDTO } from '../dto/helpMeBoard/response.help.me.board.dto';
import { UpdateHelpMeBoardDto } from '../dto/helpMeBoard/update.help.me.board.dto';
import { HelpMeBoardResponseDTO } from '../dto/helpMeBoard/update.help.me.board.response.dto';

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

  async countPagedHelpMeBoards() {
    const limit = 10;
    const total = await this.helpMeBoardRepository.findTotalBoards();
    const Page = total / limit;
    const totalPage = Math.ceil(Page);
    return { total, totalPage };
  }

  // -----이 기능은 프론트와 상의중인 기능입니다 -----
  async findPagedHelpMeBoards(
    page: number,
  ): Promise<{ data: PageByHelpMeBoardResponseDTO[]; total: number }> {
    const limit = 10;
    const skip = (page - 1) * limit;
    const boards = await this.helpMeBoardRepository.findPageByHelpMeBoards(
      skip,
      limit,
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

  async findOneHelpMeBoard(
    boardId: number,
    userId: number,
  ): Promise<oneHelpMeBoardResponseDTO> {
    const board = await this.helpMeBoardRepository.findHelpMeBoardById(boardId);
    const unitOwner = board.userId === userId;
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
      unitOwner: unitOwner,
    };
  }

  async updateBoard(
    userId: number,
    boardId: number,
    boardData: UpdateHelpMeBoardDto,
  ): Promise<HelpMeBoardResponseDTO> {
    const existingBoard =
      await this.helpMeBoardRepository.findHelpMeBoardById(boardId);
    for (const key in boardData) {
      if (boardData.hasOwnProperty(key)) {
        existingBoard[key] = boardData[key];
      }
    }
    const updatedBoard =
      await this.helpMeBoardRepository.updateHelpMeBoard(existingBoard);
    const unitOwner = userId === updatedBoard.userId;
    return {
      id: updatedBoard.id,
      head: updatedBoard.head,
      body: updatedBoard.body,
      createdAt: updatedBoard.createdAt,
      updatedAt: updatedBoard.updatedAt,
      categoryId: updatedBoard.categoryId,
      user: {
        name: updatedBoard.user.name,
        userImage: updatedBoard.user.userImage
          ? updatedBoard.user.userImage
          : [],
      },

      unitOwner: unitOwner,
    };
  }

  async deleteBoard(boardId: number, userId: number): Promise<void> {
    const board = await this.helpMeBoardRepository.findHelpMeBoardById(boardId);

    if (!board) {
      throw new Error('존재하지 않는 게시물입니다.');
    }

    if (board.userId !== userId) {
      throw new Error('작성한 게시물이 아닙니다.');
    }

    await this.helpMeBoardRepository.deleteBoard(board);
  }
}
