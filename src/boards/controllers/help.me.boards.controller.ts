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
import { ApiUploadHelpMeBoardImages } from '../swagger-decorators/helpMeBoard/add-help-me-baord-images-decorator';
import { ApiTags } from '@nestjs/swagger';
import { ApiUpdateHelpMeBoardImage } from '../swagger-decorators/helpMeBoard/patch-help-me-board-images-decorators';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { ApiAddHelpMeBoard } from '../swagger-decorators/helpMeBoard/add-help-me-board-decorator';
import { CreateHelpMeBoardDto } from '../dto/helpMeBoard/creare.help.me.board.dto';
import { HelpMeBoard } from '../entities/help-me-board.entity';
// import { PageByHelpMeBoardResponseDTO } from '../dto/helpMeBoard/response.help.me.board.dto';
import { JwtOptionalGuard } from 'src/config/guards/jwt-optional.guard';
import { oneHelpMeBoardResponseDTO } from '../dto/helpMeBoard/one.response.help.me.board.dto';
import { ApiGetOneHelpMeBoard } from '../swagger-decorators/helpMeBoard/get-one-help-me-board.dtd';
import { ApiUpdateHelpMeBoard } from '../swagger-decorators/helpMeBoard/patch-help-me-board.decorator';

@Controller('HelpMeBoard')
@ApiTags('HelpMeBoard API')
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
  async uploadImage(
    @GetUserId() userId: number,
    @Query('helpMeBoardId') boardId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<CreateHelpMeBoardImageDto[]> {
    return await this.boardImagesService.createHelpMeBoardImages(
      boardId,
      files,
      userId,
    );
  }

  // --- 이 기능은 아직 프론트와 상의중인 기능입니다 ---
  // @Get('')
  // // @ApiGetPageBoards()
  // async findPageBoards(
  //   @Query('page') page = 1,
  //   @Query('limit') limit = 30,
  // ): Promise<{ data: PageByHelpMeBoardResponseDTO[]; total: number }> {
  //   return await this.helpMeBoardService.findPagedHelpMeBoards(page, limit); //여기서 await 안걸고 넘겨도, 서비스딴에서 await 걸려서 넘어옴. async 쓸필요 x
  // }

  @Get('/unit') //하나의 게시판 불러오기
  @UseGuards(JwtOptionalGuard)
  @ApiGetOneHelpMeBoard()
  async findOne(
    @Query('boardId') boardId: number,
    @GetUserId() userId: number,
  ): Promise<oneHelpMeBoardResponseDTO> {
    return await this.helpMeBoardService.findOneHelpMeBoard(boardId, userId);
  }

  @Patch('')
  @ApiUpdateHelpMeBoard()
  async editBoard(
    @Query('boardId') boardId: number,
    @Body() boardData: Partial<HelpMeBoard>,
  ): Promise<HelpMeBoard> {
    return await this.helpMeBoardService.updateBoard(boardId, boardData);
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
  // @ApiDeleteBoard()
  async deleteBoard(
    @Query('helpMeBoardId') boardId: number,
    @GetUserId() userId: number,
  ) {
    await this.helpMeBoardService.deleteBoard(boardId, userId);
  }
}
