import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MentorBoardRepository } from '../repository/mentor.boards.repository';
import { CreateMentorBoardDto } from '../dto/mentorBoard/create.mentor.board.dto';
import { MentorBoard } from '../entities/mentor-board.entity';
import { PageByMentorBoardResponseDTO } from '../dto/mentorBoard/response.mentor.boards.dto';
import { MentorBoardResponseDTO } from '../dto/mentorBoard/update.mentor.board.response.dto';
import { UpdateMentorBoardDto } from '../dto/mentorBoard/update.mentor.board.dto';
import { oneMentorBoardResponseDTO } from '../dto/mentorBoard/one.response.mentor.boards.dto';
import { FindOneOptions } from 'typeorm';

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

  async randomMentorBoards() {
    const limit = 3;
    const boards =
      await this.mentorBoardRepository.findRandomMentorBoard(limit);
    const randomBoardResponse: PageByMentorBoardResponseDTO[] =
      await Promise.all(
        boards.map(async (board) => {
          return {
            id: board.id,
            head: board.head,
            body: board.body.substring(0, 30),
            createdAt: board.createdAt,
            updatedAt: board.updatedAt,
            categoryId: board.categoryId,
            user: {
              name: board.user.name,
              userImage: board.user.userImage ? board.user.userImage : [],
            },
            mentorBoardImages: (board.mentorBoardImages || []).map((image) => ({
              // 예외처리 - 이미지 없을경우 빈배열
              id: image.id,
              imageUrl: image.imageUrl,
            })),
          };
        }),
      );

    return { data: randomBoardResponse };
  }

  async countPagedMentorBoards(categoryId) {
    const limit = 10;
    const total = categoryId // 예외처리 - categoryId가 들어올 경우
      ? await this.mentorBoardRepository.findTotalBoardsByCategoryId(categoryId)
      : await this.mentorBoardRepository.findTotalBoards();
    const page = total / limit;
    const totalPage = Math.ceil(page);
    return { total, totalPage };
  }

  async findPagedMentorBoards(
    page: number,
    categoryId: number,
  ): Promise<{ data: PageByMentorBoardResponseDTO[] }> {
    const limit = 10;
    const skip = (page - 1) * limit;
    const boards = categoryId // 예외처리 - categoryId가 들어올 경우
      ? await this.mentorBoardRepository.findPagedBoardsByCategoryId(
          skip,
          limit,
          categoryId,
        )
      : await this.mentorBoardRepository.findPagedBoards(skip, limit);

    const boardResponse: PageByMentorBoardResponseDTO[] = await Promise.all(
      boards.map(async (board) => {
        return {
          id: board.id,
          head: board.head,
          body: board.body.substring(0, 30),
          createdAt: board.createdAt,
          updatedAt: board.updatedAt,
          categoryId: board.categoryId,
          user: {
            name: board.user.name,
            userImage: board.user.userImage ? board.user.userImage : [],
          },
          mentorBoardImages: (board.mentorBoardImages || []).map((image) => ({
            // 예외처리 - 이미지 없을경우 빈배열
            id: image.id,
            imageUrl: image.imageUrl,
          })),
        };
      }),
    );

    return { data: boardResponse };
  }

  async findOneByOrNotFound(
    options: FindOneOptions<MentorBoard>,
  ): Promise<MentorBoard> {
    const existMentorBoard =
      await this.mentorBoardRepository.findOneMentorBoard(options);

    if (!existMentorBoard) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }

    return existMentorBoard;
  }

  async findOneMentorBoard(
    mentorBoardId: number,
    userId: number,
  ): Promise<oneMentorBoardResponseDTO> {
    const mentorBoard =
      await this.mentorBoardRepository.findMentorBoardById(mentorBoardId);
    const unitOwner = mentorBoard.userId === userId;

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
      mentorBoardImages: mentorBoard.mentorBoardImages.map((image) => ({
        id: image.id,
        imageUrl: image.imageUrl,
      })),
      unitOwner: unitOwner,
    };
  }

  async updateMentorBoard(
    userId: number,
    mentorBoardId: number,
    boardData: UpdateMentorBoardDto,
  ): Promise<MentorBoardResponseDTO> {
    const existingBoard =
      await this.mentorBoardRepository.findMentorBoardById(mentorBoardId);
    for (const key in boardData) {
      if (boardData.hasOwnProperty(key)) {
        existingBoard[key] = boardData[key];
      }
    }

    const updatedBoard =
      await this.mentorBoardRepository.updateMentorBoard(existingBoard);
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

  async deleteBoard(mentorBoardId: number, userId: number): Promise<void> {
    const board =
      await this.mentorBoardRepository.findMentorBoardById(mentorBoardId);

    if (!board) {
      throw new NotFoundException('존재하지 않는 게시물입니다.');
    }

    if (board.userId !== userId) {
      throw new ForbiddenException('작성한 게시물이 아닙니다.');
    }

    await this.mentorBoardRepository.deleteBoard(board);
  }
}
