import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryService } from '@src/category/services/category.service';
import { HelpYouCommentPageQueryDto } from '@src/comments/dto/help-you-comment-page-query.dto';
import { HelpYouCommentWithUserAndUserImageDto } from '@src/comments/dto/help-you-comment-with-user-and-user-image.dto';
import { HelpYouCommentPaginationResponseDto } from '@src/comments/dto/help-you-comment-pagination-response.dto';
import { CreateHelpMeBoardDto } from '@src/boards/dto/helpMeBoard/create.help.me.board.dto';
import { HelpMeBoardPageQueryDto } from '@src/boards/dto/helpMeBoard/help-me-board-page-query.dto';
import { HelpMeBoardPaginationResponseDto } from '@src/boards/dto/helpMeBoard/help-me-board-pagination-response.dto';
import { HelpMeBoardWithUserAndImagesDto } from '@src/boards/dto/helpMeBoard/help-me-board-with-user-and-images.dto';
import { oneHelpMeBoardResponseDTO } from '@src/boards/dto/helpMeBoard/one.response.help.me.board.dto';
import { UpdateHelpMeBoardDto } from '@src/boards/dto/helpMeBoard/update.help.me.board.dto';
import { HelpMeBoardResponseDTO } from '@src/boards/dto/helpMeBoard/update.help.me.board.response.dto';
import { HelpMeBoard } from '@src/boards/entities/help-me-board.entity';
import { HelpMeBoardRepository } from '@src/boards/repository/help.me.board.repository';
import { HelpMeBoardDto } from '@src/boards/dto/helpMeBoard/help-me-board.dto';

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

    const [helpMeBoards, totalCount] =
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
      totalCount,
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

    const [helpYouComments, totalCount] =
      await this.helpMeBoardRepository.findAllHelpYouCommentsByQueryBuilder(
        helpMeBoard.id,
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
      totalCount,
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

  async findOneOrFail(helpMeBoardId: number) {
    const existHelpMeBoard =
      await this.helpMeBoardRepository.findOneHelpMeBoardBy(helpMeBoardId);

    if (!existHelpMeBoard) {
      throw new NotFoundException('해당 도와주세요 게시글을 찾을 수 없습니다.');
    }

    return new HelpMeBoardDto(existHelpMeBoard);
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
