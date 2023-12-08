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
import { MentorBoardService } from '../services/mentor.board.service';
import { MentorBoard } from '../entities/mentor-board.entity';
import { CreateMentorBoardDto } from '../dto/create.mentor.board.dto';
import { BoardResponseDTO } from '../dto/boards.response.dto';
import { ApiAddBoard } from '../swagger-decorators/add-board-decorators';
import { ApiGetPageBoards } from '../swagger-decorators/get-page-boards-decorators';
import { ApiGetOneMentorBoard } from '../swagger-decorators/get-one-mentor-board-decorators';
import { ApiUpdateBoard } from '../swagger-decorators/patch-board-decorators';
import { ApiTags } from '@nestjs/swagger';
import { ApiDeleteBoard } from '../swagger-decorators/delete-board-decorators';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { JwtOptionalGuard } from 'src/config/guards/jwt-optional.guard';

@Controller('mentorBoard')
@ApiTags('mentorBoard API')
export class MentorBoardController {
  constructor(private readonly mentorBoardService: MentorBoardService) {}

  @Post('')
  @UseGuards(JwtAccessTokenGuard)
  @ApiAddBoard()
  create(
    @GetUserId() userId: number,
    @Body() createMentorBoardDto: CreateMentorBoardDto,
  ): Promise<MentorBoard> {
    return this.mentorBoardService.create(createMentorBoardDto, userId);
  }

  @Get('') // 이부분은 아직 프론트랑 상의중입니다
  @ApiGetPageBoards()
  async findPageBoards(
    @Query('page') page = 1,
    @Query('limit') limit = 30,
  ): Promise<{ data: BoardResponseDTO[]; total: number }> {
    return await this.mentorBoardService.findPagedBoards(page, limit);
  }

  @Get('/unit') //하나의 게시판 불러오기
  @UseGuards(JwtOptionalGuard)
  @ApiGetOneMentorBoard()
  findOne(
    @Query('mentorBoardId') mentorBoardId: number,
    @GetUserId() userId: number,
  ): Promise<BoardResponseDTO> {
    return this.mentorBoardService.findOneMentorBoard(mentorBoardId, userId);
  }

  @Patch('')
  @ApiUpdateBoard()
  editBoard(
    @Query('mentorBoardId') mentorBoardId: number,
    @Body() boardData: Partial<MentorBoard>,
  ): Promise<MentorBoard> {
    return this.mentorBoardService.updateMentorBoard(mentorBoardId, boardData);
  }

  @Delete('')
  @UseGuards(JwtAccessTokenGuard)
  @ApiDeleteBoard()
  deleteBoard(
    @Query('mentorBoardId') mentorBoardId: number,
    @GetUserId() userId: number,
  ) {
    this.mentorBoardService.deleteBoard(mentorBoardId, userId);
  }
}
