import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SearchService } from '../services/search.service';
import { ApiSearchBoardsByHeadOrBodyOrUserName } from '../swagger-decorators/search-boards-by-head-or-body-or-user-name.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ApiSearchBoardsByBody } from '../swagger-decorators/search-boards-by-body.decorator';
import { ApiSearchBoardsByHead } from '../swagger-decorators/search-boards-by-head.decorator';
import { ApiSearchBoardsByUserName } from '../swagger-decorators/search-boards-by-user-name.decorator';
import { SuccessResponseInterceptor } from 'src/common/interceptors/success-response.interceptor';
import { SearchAllPageSizeDto } from '../dtos/search-all-page-size.dto';
import { SearchAllBoardsAndMentorsQueryDto } from '../dtos/search-all-boards-and-mentors-query.dto';
import { ApiSearchAllBoardsAndMentors } from '../swagger-decorators/search-all-boards-and-mentors.swagger';
import { ApiSearchAllBoardsAndMentorsForPageSize } from '../swagger-decorators/search-all-boards-and-mentors-for-page-size.swagger';
import { SearchAllHelpMeBoardDto } from '../dtos/search-all-help-me-board.dto';
import { SearchAllMentorDto } from '../dtos/search-all-mentor.dto';

@ApiTags('SEARCH')
@UseInterceptors(SuccessResponseInterceptor, ClassSerializerInterceptor)
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  /**
   * @todo 추후 변경 가능성 높음.
   * 검색할 type(제목, 본문 등)이 있는지에 따라 어디를 검색할지 한 메서드에서 처리할 수 있을 것 같음.
   */
  @Get()
  @ApiSearchAllBoardsAndMentors()
  searchAllBoardsAndMentors(
    @Query()
    searchAllBoardsAndMentorsQueryDto: SearchAllBoardsAndMentorsQueryDto,
  ): Promise<{
    helpMeBoards: SearchAllHelpMeBoardDto[];
    mentors: SearchAllMentorDto[];
  }> {
    return this.searchService.searchAllBoardsAndMentors(
      searchAllBoardsAndMentorsQueryDto,
    );
  }

  @Get('count')
  @ApiSearchAllBoardsAndMentorsForPageSize()
  searchAllBoardsAndMentorsForPageSize(
    @Query()
    searchAllBoardsAndMentorsQueryDto: SearchAllBoardsAndMentorsQueryDto,
  ): Promise<SearchAllPageSizeDto> {
    return this.searchService.searchAllBoardsAndMentorsForPageSize(
      searchAllBoardsAndMentorsQueryDto.searchQuery,
    );
  }

  /**
   * @todo 삭제 예정
   */
  @ApiSearchBoardsByHeadOrBodyOrUserName()
  @Get('boards/:category')
  async searchBoardsByHeadOrUserOrName(
    @Param('category') category: string,
    @Query('head') head: string,
    @Query('body') body: string,
    @Query('userName') userName: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.searchService.searchBoardsByHeadOrBodyOrUserName(
      head,
      body,
      userName,
      category,
      page,
      limit,
    );
  }

  /**
   * @todo 삭제 예정
   */
  @ApiSearchBoardsByHead()
  @Get('boards/:category/head')
  async searchBoardsByHead(
    @Param('category') category: string,
    @Query('searchQuery') searchQuery: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.searchService.searchBoardsByHead(
      category,
      searchQuery,
      page,
      limit,
    );
  }

  /**
   * @todo 삭제 예정
   */
  @ApiSearchBoardsByBody()
  @Get('boards/:category/body')
  async searchBoardsByBody(
    @Param('category') category: string,
    @Query('searchQuery') searchQuery: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.searchService.searchBoardsByBody(
      category,
      searchQuery,
      page,
      limit,
    );
  }

  /**
   * @todo 삭제 예정
   */
  @ApiSearchBoardsByUserName()
  @Get('boards/:category/userName')
  async searchBoardsByUserName(
    @Param('category') category: string,
    @Query('searchQuery') searchQuery: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.searchService.searchBoardsByUserName(
      category,
      searchQuery,
      page,
      limit,
    );
  }

  /**
   * @todo 삭제 예정
   */
  @Get('users')
  async searchUsersByName(@Query('searchQuery') searchQuery: string) {
    return this.searchService.searchUsersByName(searchQuery);
  }
}
