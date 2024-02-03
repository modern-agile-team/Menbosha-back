import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HelpMeBoardRepository } from '../repository/help.me.board.repository';
import { oneHelpMeBoardResponseDTO } from '../dto/helpMeBoard/one.response.help.me.board.dto';
import { CreateHelpMeBoardDto } from '../dto/helpMeBoard/create.help.me.board.dto';
import { HelpMeBoard } from '../entities/help-me-board.entity';
import { UpdateHelpMeBoardDto } from '../dto/helpMeBoard/update.help.me.board.dto';
import { HelpMeBoardResponseDTO } from '../dto/helpMeBoard/update.help.me.board.response.dto';
import { HelpMeBoardPageQueryDto } from '../dto/helpMeBoard/help-me-board-page-query.dto';
import { CategoryService } from 'src/category/services/category.service';
import { HelpMeBoardWithUserAndImagesDto } from '../dto/helpMeBoard/help-me-board-with-user-and-images.dto';
import { HelpMeBoardPaginationResponseDto } from '../dto/helpMeBoard/help-me-board-pagination-response.dto';
import { HelpYouCommentPageQueryDto } from 'src/comments/dto/help-you-comment-page-query.dto';
import { HelpYouCommentWithUserAndUserImageDto } from 'src/comments/dto/help-you-comment-with-user-and-user-image.dto';
import { HelpYouCommentPaginationResponseDto } from 'src/comments/dto/help-you-comment-pagination-response.dto';

@Injectable()
export class HelpMeBoardService {
  constructor(
    private readonly helpMeBoardRepository: HelpMeBoardRepository,
    private readonly categoryService: CategoryService,
  ) {}
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

  async countPagedHelpMeBoards(categoryId: number) {
    const limit = 10;
    const total = categoryId // 예외처리 - categoryId가 들어올 경우
      ? await this.helpMeBoardRepository.findTotalBoardsByCategoryId(categoryId)
      : await this.helpMeBoardRepository.findTotalBoards();
    const page = total / limit;
    const totalPage = Math.ceil(page);
    return { total, totalPage };
  }

  async findAllHelpMeBoard(
    helpMeBoardPageQueryDto: HelpMeBoardPageQueryDto,
  ): Promise<HelpMeBoardPaginationResponseDto> {
    const { page, pageSize, orderField, sortOrder, ...filter } =
      helpMeBoardPageQueryDto;

    const category = await this.categoryService.findOneCategoryOrNotFound(
      filter.categoryId,
    );

    filter.categoryId = category.id;

    const skip = (page - 1) * pageSize;

    const helpMeBoards =
      await this.helpMeBoardRepository.findAllHelpMeBoardsByQueryBuilder(
        skip,
        pageSize,
        orderField,
        sortOrder,
        filter,
      );

    const helpMeBoardWithUserAndImagesDtos = helpMeBoards.map((helpMeBoard) => {
      return new HelpMeBoardWithUserAndImagesDto(helpMeBoard);
    });

    return new HelpMeBoardPaginationResponseDto(
      helpMeBoardWithUserAndImagesDtos,
      helpMeBoards.length,
      page,
      pageSize,
    );
  }

  async findAllHelpYouComments(
    myId: number,
    helpMeBoardId: number,
    helpYouCommentPageQueryDto: HelpYouCommentPageQueryDto,
  ): Promise<HelpYouCommentPaginationResponseDto> {
    const helpMeBoard =
      await this.helpMeBoardRepository.findOneHelpMeBoardBy(helpMeBoardId);

    if (!helpMeBoard) {
      throw new NotFoundException('해당 글이 존재하지 않습니다.');
    }

    const { page, pageSize, orderField, sortOrder, ...filter } =
      helpYouCommentPageQueryDto;

    const skip = (page - 1) * pageSize;

    const helpYouComments =
      await this.helpMeBoardRepository.findAllHelpYouCommentsByQueryBuilder(
        skip,
        pageSize,
        orderField,
        sortOrder,
        filter,
      );

    const helpYouCommentsWithUserAndUserImageDto = helpYouComments.map(
      (helpYouComment) =>
        new HelpYouCommentWithUserAndUserImageDto(helpYouComment, myId),
    );

    return new HelpYouCommentPaginationResponseDto(
      helpYouCommentsWithUserAndUserImageDto,
      helpYouComments.length,
      page,
      pageSize,
    );
  }

  async findOneHelpMeBoard(
    boardId: number,
    userId: number,
  ): Promise<oneHelpMeBoardResponseDTO> {
    const board = await this.helpMeBoardRepository.findHelpMeBoardById(boardId);
    if (!board) {
      throw new NotFoundException('게시물을 찾을 수 없습니다');
    }
    const unitOwner = board.userId === userId;
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

  async pullingUpHelpMeBoards(
    userId: number,
    boardId: number,
  ): Promise<string> {
    const board = await this.helpMeBoardRepository.findHelpMeBoardById(boardId);
    if (!board) {
      throw new NotFoundException('게시물을 찾을 수 없습니다');
    }
    if (userId !== board.userId) {
      throw new ForbiddenException('사용자가 작성한 게시물이 아닙니다');
    }
    const currentDate = new Date();
    board.pullingUp = currentDate;
    await this.helpMeBoardRepository.pullingUpHelpMeBoard(board);
    return '끌어올리기가 완료되었습니다.';
  }

  async deleteBoard(boardId: number, userId: number): Promise<void> {
    const board = await this.helpMeBoardRepository.findHelpMeBoardById(boardId);

    if (!board) {
      throw new NotFoundException('게시물을 찾을 수 없습니다');
    }

    if (board.userId !== userId) {
      throw new ForbiddenException('사용자가 작성한 게시물이 아닙니다');
    }

    await this.helpMeBoardRepository.deleteBoard(board);
  }
}
