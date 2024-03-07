import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  UsePipes,
  ValidationPipe,
  ClassSerializerInterceptor,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUserId } from '@src/common/decorators/get-userId.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SuccessResponseInterceptor } from '@src/common/interceptors/success-response.interceptor';
import {
  AccessTokenAuthGuard,
  AccessTokenOptionalAuthGuard,
} from '@src/auth/jwt/jwt-auth.guard';
import { CreateMentorBoardDto } from '@src/boards/dto/mentorBoard/create.mentor.board.dto';
import { CreateMentorBoardImageDto } from '@src/boards/dto/mentorBoard/create.mentor.board.image.dto';
import { MentorBoardPageQueryDto } from '@src/boards/dto/mentorBoard/mentor-board-page-query.dto';
import { MentorBoardPaginationResponseDto } from '@src/boards/dto/mentorBoard/mentor-board-pagination-response.dto';
import { oneMentorBoardResponseDTO } from '@src/boards/dto/mentorBoard/one.response.mentor.boards.dto';
import { UpdateMentorBoardDto } from '@src/boards/dto/mentorBoard/update.mentor.board.dto';
import { MentorBoardResponseDTO } from '@src/boards/dto/mentorBoard/update.mentor.board.response.dto';
import { MentorBoard } from '@src/boards/entities/mentor-board.entity';
import { BoardImagesService } from '@src/boards/services/BoardImage.service';
import { MentorBoardService } from '@src/boards/services/mentor.board.service';
import { ApiAddMentorBoard } from '@src/boards/swagger-decorators/mentorBoard/add-mentor-board-decorators';
import { ApiUploadMentorBoardImages } from '@src/boards/swagger-decorators/mentorBoard/add-mentor-board-images-decorator';
import { ApiDeleteMentorBoard } from '@src/boards/swagger-decorators/mentorBoard/delete-mentor-board-decorators';
import { ApiFindAllMentorBoards } from '@src/boards/swagger-decorators/mentorBoard/find-all-mentor-boards.decorator';
import { ApiGetOneMentorBoard } from '@src/boards/swagger-decorators/mentorBoard/get-one-mentor-board-decorators';
import { ApiGetPageNumberByMentorBoard } from '@src/boards/swagger-decorators/mentorBoard/get-page-number-mentor-board-decorator';
import { ApiUpdateMentorBoard } from '@src/boards/swagger-decorators/mentorBoard/patch-mentor-board-decorators';
import { ParsePositiveIntPipe } from '@src/common/pipes/parse-positive-int.pipe';

/**
 * 추후 리팩토링때
 */
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@UseInterceptors(SuccessResponseInterceptor, ClassSerializerInterceptor)
@Controller('mentor-boards')
@ApiTags('mentor-board API')
export class MentorBoardController {
  constructor(
    private readonly mentorBoardService: MentorBoardService,
    private readonly boardImagesService: BoardImagesService,
  ) {}

  @Post('')
  @UseGuards(AccessTokenAuthGuard)
  @ApiAddMentorBoard()
  async create(
    @Body() createMentorBoardDto: CreateMentorBoardDto,
    @GetUserId() userId: number,
  ): Promise<MentorBoard> {
    return await this.mentorBoardService.create(createMentorBoardDto, userId);
  }

  @Post(':mentorBoardId/images')
  @UseGuards(AccessTokenAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 3))
  @ApiUploadMentorBoardImages()
  uploadImage(
    @GetUserId() userId: number,
    @Param('mentorBoardId', ParsePositiveIntPipe) boardId: number, // Param으로 바꿔서 하기 (URI 컨벤션 이상함)
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<CreateMentorBoardImageDto[]> {
    return this.boardImagesService.createMentorBoardImages(
      boardId,
      files,
      userId,
    );
  }
  @Patch('/images')
  @UseGuards(AccessTokenAuthGuard)
  // @ApiUpdateHelpMeBoardImage()
  @UseInterceptors(FilesInterceptor('files', 3))
  async editBoardImages(
    @GetUserId() userId: number,
    @Query('mentorBoardId') boardId: number,
    @Query('deleteImageUrl') deleteImageUrl: string[],
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.boardImagesService.updateMentorBoardImages(
      boardId,
      files,
      userId,
      deleteImageUrl,
    );
  }

  @ApiFindAllMentorBoards()
  @Get()
  findAllMentorBoards(
    @Query() mentorBoardPageQueryDto: MentorBoardPageQueryDto,
  ): Promise<MentorBoardPaginationResponseDto> {
    return this.mentorBoardService.findAllMentorBoards(mentorBoardPageQueryDto);
  }

  /**
   * @deprecated 추후 클라이언트 로직이 변경됨에 따라 사라질 api
   */
  @Get('/page')
  @ApiGetPageNumberByMentorBoard()
  countPageMentorBoards(@Query('categoryId') categoryId: number) {
    return this.mentorBoardService.countPagedMentorBoards(categoryId);
  }

  @Get('/unit') //하나의 게시판 불러오기
  @UseGuards(AccessTokenOptionalAuthGuard)
  @ApiGetOneMentorBoard()
  findOne(
    @Query('mentorBoardId') mentorBoardId: number,
    @GetUserId() userId: number,
  ): Promise<oneMentorBoardResponseDTO> {
    return this.mentorBoardService.findOneMentorBoard(mentorBoardId, userId);
  }

  @Patch('')
  @UseGuards(AccessTokenAuthGuard)
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
  @UseGuards(AccessTokenAuthGuard)
  @ApiDeleteMentorBoard()
  deleteBoard(
    @Query('mentorBoardId') mentorBoardId: number,
    @GetUserId() userId: number,
  ) {
    this.mentorBoardService.deleteBoard(mentorBoardId, userId);
  }
}
