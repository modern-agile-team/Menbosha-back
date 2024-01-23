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
import { BoardImagesService } from '../services/BoardImage.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateHelpMeBoardImageDto } from '../dto/helpMeBoard/create.board-image.dto';
import { ApiUploadHelpMeBoardImages } from '../swagger-decorators/helpMeBoard/add-help-me-board-images-decorator';
import { ApiTags } from '@nestjs/swagger';
import { ApiUpdateHelpMeBoardImage } from '../swagger-decorators/helpMeBoard/patch-help-me-board-images-decorators';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { ApiAddHelpMeBoard } from '../swagger-decorators/helpMeBoard/add-help-me-board-decorator';
import { CreateHelpMeBoardDto } from '../dto/helpMeBoard/create.help.me.board.dto';
import { HelpMeBoard } from '../entities/help-me-board.entity';
import { PageByHelpMeBoardResponseDTO } from '../dto/helpMeBoard/response.help.me.board.dto';
import { JwtOptionalGuard } from 'src/config/guards/jwt-optional.guard';
import { oneHelpMeBoardResponseDTO } from '../dto/helpMeBoard/one.response.help.me.board.dto';
import { ApiGetOneHelpMeBoard } from '../swagger-decorators/helpMeBoard/get-one-help-me-board.dto';
import { ApiUpdateHelpMeBoard } from '../swagger-decorators/helpMeBoard/patch-help-me-board.decorator';
import { ApiGetPageHelpMeBoards } from '../swagger-decorators/helpMeBoard/get-page-help-me-board.decorator';
import { UpdateHelpMeBoardDto } from '../dto/helpMeBoard/update.help.me.board.dto';
import { HelpMeBoardResponseDTO } from '../dto/helpMeBoard/update.help.me.board.response.dto';
import { ApiDeleteHelpMeBoard } from '../swagger-decorators/helpMeBoard/delete-help-me-board-decorator';
import { ApiGetPageNumberByHelpMeBoard } from '../swagger-decorators/helpMeBoard/get-board-page-number.decorator';
import { PullingUpHelpMeBoardResponseDTO } from '../dto/helpMeBoard/pulling.up.response.dto';
import { ApiGetPullingUpHelpMeBoard } from '../swagger-decorators/helpMeBoard/get-pulling-up-help-me-board-decorator';
import { ApiPullingUpHelpMeBoard } from '../swagger-decorators/helpMeBoard/pulling-up-help-me-board.decorator';

@Controller('help-me-board')
@ApiTags('Help-me-board API')
export class HelpMeBoardController {
  constructor(
    private readonly helpMeBoardService: HelpMeBoardService,
    private readonly boardImagesService: BoardImagesService,
  ) {}

  @Post('')
  @UseGuards(JwtAccessTokenGuard)
  @ApiAddHelpMeBoard()
  create(
    @GetUserId() userId: number,
    @Body() createHelpMeBoardDto: CreateHelpMeBoardDto,
  ): Promise<HelpMeBoard> {
    return this.helpMeBoardService.create(createHelpMeBoardDto, userId);
  }

  @Post('/images')
  @UseGuards(JwtAccessTokenGuard)
  @UseInterceptors(FilesInterceptor('files', 3))
  @ApiUploadHelpMeBoardImages()
  uploadImage(
    @GetUserId() userId: number,
    @Query('helpMeBoardId') boardId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<CreateHelpMeBoardImageDto[]> {
    return this.boardImagesService.createHelpMeBoardImages(
      boardId,
      files,
      userId,
    );
  }

  // --- 이 기능은 아직 프론트와 상의중인 기능입니다 ---
  @Get('')
  @ApiGetPageHelpMeBoards()
  findPageBoards(
    @Query('page') page = 1,
    @Query('categoryId') categoryId: number,
  ): Promise<{ data: PageByHelpMeBoardResponseDTO[] }> {
    return this.helpMeBoardService.findPagedHelpMeBoards(page, categoryId);
  }

  @Get('/page')
  @ApiGetPageNumberByHelpMeBoard()
  countPageBoards(@Query('categoryId') categoryId: number) {
    return this.helpMeBoardService.countPagedHelpMeBoards(categoryId);
  }

  @Get('/pulling-up') //끌어올린 게시물 보여주기
  @ApiGetPullingUpHelpMeBoard()
  latestHelpMeBoard(
    @Query('categoryId') categoryId: number,
  ): Promise<{ data: PullingUpHelpMeBoardResponseDTO[] }> {
    return this.helpMeBoardService.latestHelpMeBoards(categoryId);
  }

  @Get('/unit') //하나의 게시판 불러오기
  @UseGuards(JwtOptionalGuard)
  @ApiGetOneHelpMeBoard()
  findOne(
    @Query('boardId') boardId: number,
    @GetUserId() userId: number,
  ): Promise<oneHelpMeBoardResponseDTO> {
    return this.helpMeBoardService.findOneHelpMeBoard(boardId, userId);
  }

  @Patch('')
  @UseGuards(JwtAccessTokenGuard)
  @ApiUpdateHelpMeBoard()
  editBoard(
    @GetUserId() userId: number,
    @Query('helpMeBoardId') boardId: number,
    @Body() boardData: UpdateHelpMeBoardDto,
  ): Promise<HelpMeBoardResponseDTO> {
    return this.helpMeBoardService.updateBoard(userId, boardId, boardData);
  }

  @Patch('/pulling-up')
  @ApiPullingUpHelpMeBoard()
  @UseGuards(JwtAccessTokenGuard)
  pullingUpHelpMeBoard(
    @GetUserId() userId: number,
    @Query('helpMeBoardId') boardId: number,
  ) {
    return this.helpMeBoardService.pullingUpHelpMeBoards(userId, boardId);
  }

  @Patch('/images')
  @UseGuards(JwtAccessTokenGuard)
  @ApiUpdateHelpMeBoardImage()
  @UseInterceptors(FilesInterceptor('files', 3))
  async editBoardImages(
    @GetUserId() userId: number,
    @Query('helpMeBoardId') boardId: number,
    @Query('deleteImageUrl') deleteImageUrl: string[],
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.boardImagesService.updateHelpMeBoardImages(
      boardId,
      files,
      userId,
      deleteImageUrl,
    );
  }

  @Delete('')
  @UseGuards(JwtAccessTokenGuard)
  @ApiDeleteHelpMeBoard()
  deleteBoard(
    @Query('helpMeBoardId') boardId: number,
    @GetUserId() userId: number,
  ) {
    this.helpMeBoardService.deleteBoard(boardId, userId);
  }
}
