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

  @Get('all')
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

  @Get('all/count')
  @ApiSearchAllBoardsAndMentorsForPageSize()
  searchAllBoardsAndMentorsForPageSize(
    @Query()
    searchAllBoardsAndMentorsQueryDto: SearchAllBoardsAndMentorsQueryDto,
  ): Promise<SearchAllPageSizeDto> {
    return this.searchService.searchAllBoardsAndMentorsForPageSize(
      searchAllBoardsAndMentorsQueryDto.searchQuery,
    );
  }

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

  @Get('users')
  async searchUsersByName(@Query('searchQuery') searchQuery: string) {
    return this.searchService.searchUsersByName(searchQuery);
  }
}
