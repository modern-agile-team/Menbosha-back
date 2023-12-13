import { Injectable } from '@nestjs/common';
import { HelpMeBoardRepository } from '../repository/help.me.board.repository';
import { CreateMentorBoardDto } from '../dto/create.mentor.board.dto';
import { MentorBoard } from '../entities/mentor-board.entity';
// import { BoardResponseDTO } from '../dto/boards.response.dto';
import { oneBoardResponseDTO } from '../dto/boards.one.response.dto';
import { CreateHelpMeBoardDto } from '../dto/creare.help.me.board.dto';

@Injectable()
export class HelpMeBoardService {
  constructor(private helpMeBoardRepository: HelpMeBoardRepository) {}
  async create(
    boardData: CreateHelpMeBoardDto,
    userId: number,
  ): Promise<MentorBoard> {
    try {
      return await this.helpMeBoardRepository.createBoard(boardData, userId);
    } catch (error) {
      console.log(error);
    }
  }

  // async findPagedBoards(
  //   page: number,
  //   limit: number,
  // ): Promise<{ data: BoardResponseDTO[]; total: number }> {
  //   const skip = (page - 1) * limit;
  //   const take = limit;
  //   const boards = await this.helpMeBoardRepository.findPagedBoards(skip, take);
  //   const total = await this.helpMeBoardRepository.findTotalBoards();

  //   const boardResponse: BoardResponseDTO[] = await Promise.all(
  //     boards.map(async (board) => {
  //       return {
  //         id: board.id,
  //         head: board.head,
  //         body: board.body.substring(0, 30),
  //         createdAt: board.createdAt,
  //         updatedAt: board.updatedAt,
  //         category: board.categoryId,
  //         user: {
  //           name: board.user.name,
  //           userImage: board.user.userImage ? board.user.userImage : [],
  //         },
  //         // boardImages: board.boardImages.map((image) => ({
  //         //   id: image.id,
  //         //   imageUrl: image.imageUrl,
  //         // })),
  //       };
  //     }),
  //   );

  //   return { data: boardResponse, total };
  // }

  async findOneBoard(
    boardId: number,
    userId: number,
  ): Promise<oneBoardResponseDTO> {
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
      // boardImages: board.boardImages.map((image) => ({
      //   id: image.id,
      //   imageUrl: image.imageUrl,
      // })),
      unitowner: unitowner,
    };
  }

  async updateBoard(
    boardId: number,
    boardData: Partial<CreateMentorBoardDto>,
  ): Promise<MentorBoard | undefined> {
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
