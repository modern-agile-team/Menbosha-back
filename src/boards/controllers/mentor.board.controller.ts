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
} from '@nestjs/common';
import { MentorBoardService } from '../services/mentor.board.service';
import { MentorBoard } from '../entities/mentor-board.entity';
import { CreateMentorBoardDto } from '../dto/mentorBoard/create.mentor.board.dto';
import { ApiAddMentorBoard } from '../swagger-decorators/mentorBoard/add-mentor-board-decorators';
import { ApiGetOneMentorBoard } from '../swagger-decorators/mentorBoard/get-one-mentor-board-decorators';
import { ApiUpdateMentorBoard } from '../swagger-decorators/mentorBoard/patch-mentor-board-decorators';
import { ApiTags } from '@nestjs/swagger';
import { ApiDeleteMentorBoard } from '../swagger-decorators/mentorBoard/delete-mentor-board-decorators';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { JwtOptionalGuard } from 'src/config/guards/jwt-optional.guard';
import { MentorBoardResponseDTO } from '../dto/mentorBoard/update.mentor.board.response.dto';
import { UpdateMentorBoardDto } from '../dto/mentorBoard/update.mentor.board.dto';
import { oneMentorBoardResponseDTO } from '../dto/mentorBoard/one.response.mentor.boards.dto';
import { BoardImagesService } from '../services/BoardImage.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateMentorBoardImageDto } from '../dto/mentorBoard/create.mentor.board.image.dto';
import { ApiUploadMentorBoardImages } from '../swagger-decorators/mentorBoard/add-mentor-board-images-decorator';
import { ApiGetPageNumberByMentorBoard } from '../swagger-decorators/mentorBoard/get-page-number-mentor-board-decorator';
import { MentorBoardPaginationResponseDto } from '../dto/mentorBoard/mentor-board-pagination-response.dto';
import { MentorBoardPageQueryDto } from '../dto/mentorBoard/mentor-board-page-query.dto';
import { ApiFindAllHotPosts } from '../swagger-decorators/mentorBoard/find-all-mentor-boards.decorator';

/**
 * 추후 리팩토링때
 */
@Controller('mentor-boards')
@ApiTags('mentor-board API')
export class MentorBoardController {
  constructor(
    private readonly mentorBoardService: MentorBoardService,
    private readonly boardImagesService: BoardImagesService,
  ) {}

  @Post('')
  @UseGuards(JwtAccessTokenGuard)
  @ApiAddMentorBoard()
  async create(
    @Body() createMentorBoardDto: CreateMentorBoardDto,
    @GetUserId() userId: number,
  ): Promise<MentorBoard> {
    return await this.mentorBoardService.create(createMentorBoardDto, userId);
  }

  @Post('/images')
  @UseGuards(JwtAccessTokenGuard)
  @UseInterceptors(FilesInterceptor('files', 3))
  @ApiUploadMentorBoardImages()
  uploadImage(
    @GetUserId() userId: number,
    @Query('mentorBoardId') boardId: number, // Param으로 바꿔서 하기 (URI 컨벤션 이상함)
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<CreateMentorBoardImageDto[]> {
    return this.boardImagesService.createMentorBoardImages(
      boardId,
      files,
      userId,
    );
  }

  @ApiFindAllHotPosts()
  @Get()
  findAllMentorBoards(
    @Query() mentorBoardPageQueryDto: MentorBoardPageQueryDto,
  ): Promise<MentorBoardPaginationResponseDto> {
    return this.mentorBoardService.findAllMentorBoards(mentorBoardPageQueryDto);
  }

  @Get('/page')
  @ApiGetPageNumberByMentorBoard()
  countPageMentorBoards(@Query('categoryId') categoryId: number) {
    return this.mentorBoardService.countPagedMentorBoards(categoryId);
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
  @ApiDeleteMentorBoard()
  deleteBoard(
    @Query('mentorBoardId') mentorBoardId: number,
    @GetUserId() userId: number,
  ) {
    this.mentorBoardService.deleteBoard(mentorBoardId, userId);
  }
}
