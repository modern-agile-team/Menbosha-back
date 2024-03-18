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
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { GetUserId } from '@src/common/decorators/get-userId.decorator';
import { HelpYouCommentPageQueryDto } from '@src/comments/dto/help-you-comment-page-query.dto';
import { HelpYouCommentPaginationResponseDto } from '@src/comments/dto/help-you-comment-pagination-response.dto';
import { ApiFindAllHelpYouComments } from '@src/comments/swagger-decorators/find-all-help-you-comments.decorator';
import { ParsePositiveIntPipe } from '@src/common/pipes/parse-positive-int.pipe';
import { SuccessResponseInterceptor } from '@src/common/interceptors/success-response.interceptor';
import {
  AccessTokenAuthGuard,
  AccessTokenOptionalAuthGuard,
} from '@src/auth/jwt/jwt-auth.guard';
import { CreateHelpMeBoardImageDto } from '@src/boards/dto/helpMeBoard/create.board-image.dto';
import { CreateHelpMeBoardDto } from '@src/boards/dto/helpMeBoard/create.help.me.board.dto';
import { HelpMeBoardPageQueryDto } from '@src/boards/dto/helpMeBoard/help-me-board-page-query.dto';
import { HelpMeBoardPaginationResponseDto } from '@src/boards/dto/helpMeBoard/help-me-board-pagination-response.dto';
import { oneHelpMeBoardResponseDTO } from '@src/boards/dto/helpMeBoard/one.response.help.me.board.dto';
import { UpdateHelpMeBoardDto } from '@src/boards/dto/helpMeBoard/update.help.me.board.dto';
import { HelpMeBoardResponseDTO } from '@src/boards/dto/helpMeBoard/update.help.me.board.response.dto';
import { BoardImagesService } from '@src/boards/services/BoardImage.service';
import { HelpMeBoardService } from '@src/boards/services/help.me.board.service';
import { ApiAddHelpMeBoard } from '@src/boards/swagger-decorators/helpMeBoard/add-help-me-board-decorator';
import { ApiUploadHelpMeBoardImages } from '@src/boards/swagger-decorators/helpMeBoard/add-help-me-board-images-decorator';
import { ApiDeleteHelpMeBoard } from '@src/boards/swagger-decorators/helpMeBoard/delete-help-me-board-decorator';
import { ApiFindAllHelpMeBoards } from '@src/boards/swagger-decorators/helpMeBoard/find-all-help-me-boards.decorator';
import { ApiGetPageNumberByHelpMeBoard } from '@src/boards/swagger-decorators/helpMeBoard/get-board-page-number.decorator';
import { ApiGetOneHelpMeBoard } from '@src/boards/swagger-decorators/helpMeBoard/get-one-help-me-board.dto';
import { ApiUpdateHelpMeBoardImage } from '@src/boards/swagger-decorators/helpMeBoard/patch-help-me-board-images-decorators';
import { ApiUpdateHelpMeBoard } from '@src/boards/swagger-decorators/helpMeBoard/patch-help-me-board.decorator';
import { ApiPullingUpHelpMeBoard } from '@src/boards/swagger-decorators/helpMeBoard/pulling-up-help-me-board.decorator';
import { HelpMeBoard } from '@src/entities/HelpMeBoard';

/**
 * 팀원과 상의되면 주석처리된 옵션도 걸어줌.
 */
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@Controller('help-me-boards')
@ApiTags('Help-me-board API')
export class HelpMeBoardController {
  constructor(
    private readonly helpMeBoardService: HelpMeBoardService,
    private readonly boardImagesService: BoardImagesService,
  ) {}

  @Post('')
  @UseGuards(AccessTokenAuthGuard)
  @ApiAddHelpMeBoard()
  create(
    @GetUserId() userId: number,
    @Body() createHelpMeBoardDto: CreateHelpMeBoardDto,
  ): Promise<HelpMeBoard> {
    return this.helpMeBoardService.create(createHelpMeBoardDto, userId);
  }

  @Post(':helpMeBoardId/images')
  @UseGuards(AccessTokenAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 3))
  @ApiUploadHelpMeBoardImages()
  uploadImage(
    @GetUserId() userId: number,
    @Param('helpMeBoardId', ParsePositiveIntPipe) boardId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<CreateHelpMeBoardImageDto[]> {
    return this.boardImagesService.createHelpMeBoardImages(
      boardId,
      files,
      userId,
    );
  }

  /**
   * @deprecated 추후 클라이언트 로직이 변경됨에 따라 사라질 api
   */
  @Get('/page')
  @ApiGetPageNumberByHelpMeBoard()
  countPageBoards(@Query('categoryId') categoryId: number) {
    return this.helpMeBoardService.countPagedHelpMeBoards(categoryId);
  }

  @UseInterceptors(SuccessResponseInterceptor, ClassSerializerInterceptor)
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
  @ApiTags('help-you-comment API')
  @Get(':helpMeBoardId/help-you-comments')
  @UseInterceptors(SuccessResponseInterceptor, ClassSerializerInterceptor)
  @UseGuards(AccessTokenOptionalAuthGuard)
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
  @UseGuards(AccessTokenOptionalAuthGuard)
  @ApiGetOneHelpMeBoard()
  findOne(
    @Query('boardId') boardId: number,
    @GetUserId() userId: number,
  ): Promise<oneHelpMeBoardResponseDTO> {
    return this.helpMeBoardService.findOneHelpMeBoard(boardId, userId);
  }

  @Patch('')
  @UseGuards(AccessTokenAuthGuard)
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
  @UseGuards(AccessTokenAuthGuard)
  pullingUpHelpMeBoard(
    @GetUserId() userId: number,
    @Query('helpMeBoardId') boardId: number,
  ) {
    return this.helpMeBoardService.pullingUpHelpMeBoards(userId, boardId);
  }

  @Patch(':helpMeBoardId/images')
  @UseGuards(AccessTokenAuthGuard)
  @ApiUpdateHelpMeBoardImage()
  @UseInterceptors(FilesInterceptor('files', 3))
  async editBoardImages(
    @GetUserId() userId: number,
    @Param('helpMeBoardId') boardId: number,
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessTokenAuthGuard)
  @ApiDeleteHelpMeBoard()
  deleteBoard(
    @Query('helpMeBoardId', ParsePositiveIntPipe) boardId: number,
    @GetUserId() userId: number,
  ) {
    return this.helpMeBoardService.deleteBoard(boardId, userId);
  }
}
