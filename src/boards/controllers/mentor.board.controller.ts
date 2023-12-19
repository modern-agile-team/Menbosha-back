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
import { CreateMentorBoardDto } from '../dto/mentorBoard/create.mentor.board.dto';
import { PageByMentorBoardResponseDTO } from '../dto/mentorBoard/response.mentor.boards.dto';
import { ApiAddMentorBoard } from '../swagger-decorators/add-mentor-board-decorators';
import { ApiGetPageMentorBoards } from '../swagger-decorators/get-page-mentor-boards-decorators';
import { ApiGetOneMentorBoard } from '../swagger-decorators/get-one-mentor-board-decorators';
import { ApiUpdateMentorBoard } from '../swagger-decorators/patch-mentor-board-decorators';
import { ApiTags } from '@nestjs/swagger';
import { ApiDeleteBoard } from '../swagger-decorators/delete-board-decorators';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { JwtOptionalGuard } from 'src/config/guards/jwt-optional.guard';
import { MentorBoardResponseDTO } from '../dto/mentorBoard/update.mentor.board.response.dto';
import { UpdateMentorBoardDto } from '../dto/mentorBoard/update.mentor.board.dto';
import { oneMentorBoardResponseDTO } from '../dto/mentorBoard/one.response.mentor.boards.dto';

@Controller('mentorBoard')
@ApiTags('mentorBoard API')
export class MentorBoardController {
  constructor(private readonly mentorBoardService: MentorBoardService) {}

  @Post('')
  @UseGuards(JwtAccessTokenGuard)
  @ApiAddMentorBoard()
  async create(
    @Body() createMentorBoardDto: CreateMentorBoardDto,
    @GetUserId() userId: number,
  ): Promise<MentorBoard> {
    return await this.mentorBoardService.create(createMentorBoardDto, userId);
  }

  @Get('') // 이부분은 아직 프론트랑 상의중입니다
  @ApiGetPageMentorBoards()
  findPageMentorBoards(
    @Query('page') page = 1,
    @Query('limit') limit = 30,
  ): Promise<{ data: PageByMentorBoardResponseDTO[]; total: number }> {
    return this.mentorBoardService.findPagedMentorBoards(page, limit);
  }

  @Get('/unit') //하나의 게시판 불러오기
  @UseGuards(JwtOptionalGuard)
  @ApiGetOneMentorBoard()
  findOne(
    @Query('mentorBoardId') mentorBoardId: number,
    @GetUserId() userId: number,
  ): Promise<oneMentorBoardResponseDTO> {
    return this.mentorBoardService.findOneMentorBoard(mentorBoardId, userId);
  }

  @Patch('')
  @UseGuards(JwtAccessTokenGuard)
  @ApiUpdateMentorBoard()
  editBoard(
    @GetUserId() userId: number,
    @Query('mentorBoardId') mentorBoardId: number,
    @Body() boardData: UpdateMentorBoardDto,
  ): Promise<MentorBoardResponseDTO> {
    return this.mentorBoardService.updateMentorBoard(
      userId,
      mentorBoardId,
      boardData,
    );
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
