import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MentorBoardRepository } from '../repository/mentor.boards.repository';
import { CreateMentorBoardDto } from '../dto/create.mentor.board.dto';
import { MentorBoard } from '../entities/mentor-board.entity';
import { PageByMentorBoardResponseDTO } from '../dto/response.mentor.boards.dto';

import { MentorBoardResponseDTO } from '../dto/update.mentor.board.response.dto';
import { UpdateMentorBoardDto } from '../dto/update.mentor.board.dto';
import { oneMentorBoardResponseDTO } from '../dto/one.response.mentor.boards.dto';

@Injectable()
export class MentorBoardService {
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

  async findPagedMentorBoards(
    page: number,
    limit: number,
  ): Promise<{ data: PageByMentorBoardResponseDTO[]; total: number }> {
    const skip = (page - 1) * limit;
    const take = limit;
    const boards = await this.mentorBoardRepository.findPagedBoards(skip, take);
    const total = await this.mentorBoardRepository.findTotalBoards();

    const boardResponse: PageByMentorBoardResponseDTO[] = await Promise.all(
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
        };
      }),
    );

    return { data: boardResponse, total };
  }

  async findOneMentorBoard(
    mentorBoardId: number,
    userId: number,
  ): Promise<oneMentorBoardResponseDTO> {
    const mentorBoard =
      await this.mentorBoardRepository.findBoardById(mentorBoardId);
    const unitowner = mentorBoard.userId === userId;
    console.log(mentorBoardId);

    if (!mentorBoard) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }
    return {
      id: mentorBoard.id,
      head: mentorBoard.head,
      body: mentorBoard.body,
      createdAt: mentorBoard.createdAt,
      updatedAt: mentorBoard.updatedAt,
      categoryId: mentorBoard.categoryId,
      user: {
        name: mentorBoard.user.name,
        userImage: mentorBoard.user.userImage ? mentorBoard.user.userImage : [],
      },
      unitowner: unitowner,
    };
  }

  async updateMentorBoard(
    userId: number,
    mentorBoardId: number,
    boardData: UpdateMentorBoardDto,
  ): Promise<MentorBoardResponseDTO> {
    const existingBoard =
      await this.mentorBoardRepository.findBoardById(mentorBoardId);
    for (const key in boardData) {
      if (boardData.hasOwnProperty(key)) {
        existingBoard[key] = boardData[key];
      }
    }

    const updatedBoard =
      await this.mentorBoardRepository.updateBoard(existingBoard);
    const unitowner = userId === updatedBoard.userId;
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
      unitowner: unitowner,
    };
  }

  async deleteBoard(mentorBoardId: number, userId: number): Promise<void> {
    const board = await this.mentorBoardRepository.findBoardById(mentorBoardId);

    if (!board) {
      throw new NotFoundException('존재하지 않는 게시물입니다.');
    }

    if (board.userId !== userId) {
      throw new ForbiddenException('작성한 게시물이 아닙니다.');
    }

    await this.mentorBoardRepository.deleteBoard(board);
  }
}
