import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MentorBoardsService } from '../services/mentor.board.service';
import { MentorBoard } from '../entities/mentor-board.entity';
import { CreateMentorBoardDto } from '../dto/create.mentor.board.dto';
import { BoardResponseDTO } from '../dto/boards.response.dto';
import { ApiAddBoard } from '../swagger-decorators/add-board-decorators';
import { ApiGetPageBoards } from '../swagger-decorators/get-page-boards-decorators';
import { ApiGetOneBoard } from '../swagger-decorators/get-one-board-decorators';
import { ApiUpdateBoard } from '../swagger-decorators/patch-board-decorators';
import { ApiTags } from '@nestjs/swagger';
import { ApiDeleteBoard } from '../swagger-decorators/delete-board-decorators';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { JwtOptionalGuard } from 'src/config/guards/jwt-optional.guard';

@Controller('mentorBoard')
@ApiTags('mentorBoard API')
export class MentorBoardController {
  constructor(private readonly mentorBoardsService: MentorBoardsService) {}

  @Post('')
  @UseGuards(JwtAccessTokenGuard)
  @ApiAddBoard()
  async create(
    @GetUserId() userId: number,
    @Body() createMentorBoardDto: CreateMentorBoardDto,
  ): Promise<MentorBoard> {
    return await this.mentorBoardsService.create(createMentorBoardDto, userId);
  }

  @Get('')
  @ApiGetPageBoards()
  async findPageBoards(
    @Query('page') page = 1,
    @Query('limit') limit = 30,
  ): Promise<{ data: BoardResponseDTO[]; total: number }> {
    return await this.mentorBoardsService.findPagedBoards(page, limit);
  }

  @Get('/unit') //하나의 게시판 불러오기
  @UseGuards(JwtOptionalGuard)
  @ApiGetOneBoard()
  async findOne(
    @Query('boardId') boardId: number,
    @GetUserId() userId: number,
  ): Promise<BoardResponseDTO> {
    return await this.mentorBoardsService.findOneBoard(boardId, userId);
  }

  @Patch('')
  @ApiUpdateBoard()
  async editBoard(
    @Query('boardId') boardId: number,
    @Body() boardData: Partial<MentorBoard>,
  ): Promise<MentorBoard> {
    return await this.mentorBoardsService.updateMentorBoard(boardId, boardData);
  }

  @Delete('')
  @UseGuards(JwtAccessTokenGuard)
  @ApiDeleteBoard()
  async deleteBoard(
    @Query('boardId') boardId: number,
    @GetUserId() userId: number,
  ) {
    await this.mentorBoardsService.deleteBoard(boardId, userId);
  }
}
