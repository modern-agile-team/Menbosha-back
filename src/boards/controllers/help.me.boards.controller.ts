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
  UsePipes,
  ValidationPipe,
  Param,
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
import { JwtOptionalGuard } from 'src/config/guards/jwt-optional.guard';
import { oneHelpMeBoardResponseDTO } from '../dto/helpMeBoard/one.response.help.me.board.dto';
import { ApiGetOneHelpMeBoard } from '../swagger-decorators/helpMeBoard/get-one-help-me-board.dto';
import { ApiUpdateHelpMeBoard } from '../swagger-decorators/helpMeBoard/patch-help-me-board.decorator';
import { UpdateHelpMeBoardDto } from '../dto/helpMeBoard/update.help.me.board.dto';
import { HelpMeBoardResponseDTO } from '../dto/helpMeBoard/update.help.me.board.response.dto';
import { ApiDeleteHelpMeBoard } from '../swagger-decorators/helpMeBoard/delete-help-me-board-decorator';
import { ApiGetPageNumberByHelpMeBoard } from '../swagger-decorators/helpMeBoard/get-board-page-number.decorator';
import { ApiPullingUpHelpMeBoard } from '../swagger-decorators/helpMeBoard/pulling-up-help-me-board.decorator';
import { HelpMeBoardPageQueryDto } from '../dto/helpMeBoard/help-me-board-page-query.dto';
import { HelpMeBoardPaginationResponseDto } from '../dto/helpMeBoard/help-me-board-pagination-response.dto';
import { ApiFindAllHelpMeBoards } from '../swagger-decorators/helpMeBoard/find-all-help-me-boards.decorator';
import { HelpYouCommentPageQueryDto } from 'src/comments/dto/help-you-comment-page-query.dto';
import { HelpYouCommentPaginationResponseDto } from 'src/comments/dto/help-you-comment-pagination-response.dto';
import { ApiFindAllHelpYouComments } from 'src/comments/swagger-decorators/find-all-help-you-comments.decorator';
import { ParsePositiveIntPipe } from 'src/common/pipes/parse-positive-int.pipe';

/**
 * 팀원과 상의되면 주석처리된 옵션도 걸어줌.
 */
@UsePipes(
  new ValidationPipe({
    transform: true,
    // whitelist: true,
    // forbidNonWhitelisted: true,
  }),
)
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

  @Get('/page')
  @ApiGetPageNumberByHelpMeBoard()
  countPageBoards(@Query('categoryId') categoryId: number) {
    return this.helpMeBoardService.countPagedHelpMeBoards(categoryId);
  }

  @Get()
  @ApiFindAllHelpMeBoards()
  findAllHelpMeBoard(
    @Query() helpMeBoardPageQueryDto: HelpMeBoardPageQueryDto,
  ): Promise<HelpMeBoardPaginationResponseDto> {
    return this.helpMeBoardService.findAllHelpMeBoard(helpMeBoardPageQueryDto);
  }

  /**
   * @todo 도와줄게요 댓글 컨트롤러의 prefix때문에 restful하게 api path를 짤 수가 없음.
   * 추후 prefix 수정 후 comment 컨트롤러 쪽으로 분리
   */
  @Get(':helpMeBoardId/help-you-comments')
  @UseGuards(JwtOptionalGuard)
  @ApiFindAllHelpYouComments()
  findAllHelpYouComments(
    @GetUserId() userId: number,
    @Param('helpMeBoardId', ParsePositiveIntPipe) helpMeBoardId: number,
    @Query() helpYouCommentPageQueryDto: HelpYouCommentPageQueryDto,
  ): Promise<HelpYouCommentPaginationResponseDto> {
    return this.helpMeBoardService.findAllHelpYouComments(
      userId,
      helpMeBoardId,
      helpYouCommentPageQueryDto,
    );
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
