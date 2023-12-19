import {
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

@ApiTags('SEARCH')
@UseInterceptors(SuccessResponseInterceptor)
@UsePipes(ValidationPipe)
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('count')
  searchAllBoardsAndMentorsForPageSize(
    @Query('searchQuery') searchQuery: string,
  ) {
    return this.searchService.searchAllBoardsAndMentorsForPageSize(searchQuery);
  }

  @Get()
  searchAllBoardsAndMentors() {}

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
