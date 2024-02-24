import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SearchService } from '../services/search.service';
import { ApiTags } from '@nestjs/swagger';
import { SuccessResponseInterceptor } from '@src/common/interceptors/success-response.interceptor';
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
}
