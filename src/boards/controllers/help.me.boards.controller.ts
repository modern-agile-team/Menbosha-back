import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseInterceptors,
  Query,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { HelpMeBoardService } from '../services/help.me.board.service';
import { MentorBoard } from '../entities/mentor-board.entity';
import { CreateMentorBoardDto } from '../dto/create.mentor.board.dto';
import { BoardImagesService } from '../services/BoardImage.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BoardResponseDTO } from '../dto/boards.response.dto';
import { CreateBoardImageDto } from '../dto/create.board-image.dto';
import { ApiUploadBoardImages } from '../swagger-decorators/upload-baord-images-decorator';
import { ApiAddBoard } from '../swagger-decorators/add-board-decorators';
import { ApiGetPageBoards } from '../swagger-decorators/get-page-boards-decorators';
import { ApiGetOneMentorBoard } from '../swagger-decorators/get-one-mentor-board-decorators';
import { ApiUpdateBoard } from '../swagger-decorators/patch-board-decorators';
import { ApiTags } from '@nestjs/swagger';
import { ApiDeleteBoard } from '../swagger-decorators/delete-board-decorators';
import { ApiUpdateBoardImage } from '../swagger-decorators/patch-board-images-decorators';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { JwtOptionalGuard } from 'src/config/guards/jwt-optional.guard';

@Controller('boards')
@ApiTags('board API')
export class HelpMeBoardController {
  constructor(
    private readonly helpMeBoardService: HelpMeBoardService,
    private readonly boardImagesService: BoardImagesService,
  ) {}

  @Post('/mentor')
  @UseGuards(JwtAccessTokenGuard)
  @ApiAddBoard()
  async create(
    @GetUserId() userId: number,
    @Body() createMentorBoardDto: CreateMentorBoardDto,
  ): Promise<MentorBoard> {
    return await this.helpMeBoardService.create(createMentorBoardDto, userId);
  }

  @Post('/images')
  @UseGuards(JwtAccessTokenGuard)
  @UseInterceptors(FilesInterceptor('files', 3))
  @ApiUploadBoardImages()
  async uploadImage(
    @GetUserId() userId: number,
    @Query('boardId') boardId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<CreateBoardImageDto[]> {
    return await this.boardImagesService.createBoardImages(
      boardId,
      files,
      userId,
    );
  }

  @Get('')
  @ApiGetPageBoards()
  async findPageBoards(
    @Query('page') page = 1,
    @Query('limit') limit = 30,
  ): Promise<{ data: BoardResponseDTO[]; total: number }> {
    return await this.helpMeBoardService.findPagedBoards(page, limit); //여기서 await 안걸고 넘겨도, 서비스딴에서 await 걸려서 넘어옴. async 쓸필요 x
  }

  @Get('/unit') //하나의 게시판 불러오기
  @UseGuards(JwtOptionalGuard)
  @ApiGetOneMentorBoard()
  async findOne(
    @Query('boardId') boardId: number,
    @GetUserId() userId: number,
  ): Promise<BoardResponseDTO> {
    return await this.helpMeBoardService.findOneBoard(boardId, userId);
  }

  @Patch('')
  @ApiUpdateBoard()
  async editBoard(
    @Query('boardId') boardId: number,
    @Body() boardData: Partial<MentorBoard>,
  ): Promise<MentorBoard> {
    return await this.helpMeBoardService.updateBoard(boardId, boardData);
  }

  @Patch('/images')
  @UseGuards(JwtAccessTokenGuard)
  @ApiUpdateBoardImage()
  @UseInterceptors(FilesInterceptor('files', 3))
  async editBoardImages(
    @GetUserId() userId: number,
    @Query('boardId') boardId: number,
    @Query('deleteImageUrl') deleteImageUrl: string[],
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.boardImagesService.updateBoardImages(
      boardId,
      files,
      userId,
      deleteImageUrl,
    );
  }

  @Delete('')
  @UseGuards(JwtAccessTokenGuard)
  @ApiDeleteBoard()
  async deleteBoard(
    @Query('boardId') boardId: number,
    @GetUserId() userId: number,
  ) {
    await this.helpMeBoardService.deleteBoard(boardId, userId);
  }
}
