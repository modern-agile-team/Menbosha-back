import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MentorBoardRepository } from '../repository/mentor.boards.repository';
import { CreateMentorBoardDto } from '../dto/mentorBoard/create.mentor.board.dto';
import { MentorBoard } from '../entities/mentor-board.entity';
import { MentorBoardResponseDTO } from '../dto/mentorBoard/update.mentor.board.response.dto';
import { UpdateMentorBoardDto } from '../dto/mentorBoard/update.mentor.board.dto';
import { oneMentorBoardResponseDTO } from '../dto/mentorBoard/one.response.mentor.boards.dto';
import { FindOneOptions } from 'typeorm';
import { MentorBoardLikeRepository } from '../repository/mentor.board.likes.repository';
import { MentorBoardForHotPostDto } from '../dto/mentorBoard/mentor-board-for-hot-post.dto';
import { MentorBoardPaginationResponseDto } from '../dto/mentorBoard/mentor-board-hot-post-pagination-response.dto';
import { MentorBoardPageQueryDto } from '../dto/mentorBoard/mentor-board-page-query.dto';
import { CategoryService } from 'src/category/services/category.service';

@Injectable()
export class MentorBoardService {
  constructor(
    private mentorBoardRepository: MentorBoardRepository,
    private readonly mentorBoardLikeRepository: MentorBoardLikeRepository,
    private readonly categoryService: CategoryService,
  ) {}
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

  async countPagedMentorBoards(categoryId) {
    const limit = 10;
    const total = categoryId // 예외처리 - categoryId가 들어올 경우
      ? await this.mentorBoardRepository.findTotalBoardsByCategoryId(categoryId)
      : await this.mentorBoardRepository.findTotalBoards();
    const page = total / limit;
    const totalPage = Math.ceil(page);
    return { total, totalPage };
  }

  async findAllMentorBoards(
    mentorBoardPageQueryDto: MentorBoardPageQueryDto,
  ): Promise<MentorBoardPaginationResponseDto> {
    const { page, pageSize, orderField, sortOrder, ...filter } =
      mentorBoardPageQueryDto;

    const category = await this.categoryService.findOneCategoryOrNotFound(
      filter.categoryId,
    );

    filter.categoryId = category.id;

    const skip = (page - 1) * pageSize;

    const mentorBoardHotPosts =
      await this.mentorBoardRepository.findAllMentorBoardsByQueryBuilder(
        skip,
        pageSize,
        orderField,
        sortOrder,
        filter,
      );

    const mentorBoardForHotPostDtos = mentorBoardHotPosts.map(
      (mentorBoardHotPost) => {
        return new MentorBoardForHotPostDto(mentorBoardHotPost);
      },
    );

    return new MentorBoardPaginationResponseDto(
      mentorBoardForHotPostDtos,
      mentorBoardHotPosts.length,
      page,
      pageSize,
    );
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
    const mentorBoardLike =
      await this.mentorBoardLikeRepository.countMentorBoardLike(mentorBoardId);
    const unitOwner = mentorBoard.userId === userId;
    const isLike = await this.mentorBoardLikeRepository.isLike(
      userId,
      mentorBoardId,
    );

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
      mentorBoardLikes: mentorBoardLike,
      isLike: isLike,
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
