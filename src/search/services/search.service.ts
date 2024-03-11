import { Injectable } from '@nestjs/common';
import { SearchAllBoardsAndMentorsQueryDto } from '@src/search/dtos/search-all-boards-and-mentors-query.dto';
import { SearchAllHelpMeBoardDto } from '@src/search/dtos/search-all-help-me-board.dto';
import { SearchAllMentorDto } from '@src/search/dtos/search-all-mentor.dto';
import { SearchAllPageSizeDto } from '@src/search/dtos/search-all-page-size.dto';
import { SearchRepository } from '@src/search/repositories/search.repository';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SearchService {
  constructor(private searchRepository: SearchRepository) {}

  async searchAllBoardsAndMentorsForPageSize(
    searchQuery: string,
  ): Promise<SearchAllPageSizeDto> {
    const [helpMeBoardsCount, mentorsCount] =
      await this.searchRepository.searchAllBoardsAndMentorsCount(searchQuery);

    return new SearchAllPageSizeDto(helpMeBoardsCount, mentorsCount);
  }

  async searchAllBoardsAndMentors(
    searchAllBoardsAndMentorsQueryDto: SearchAllBoardsAndMentorsQueryDto,
  ): Promise<{
    helpMeBoards: SearchAllHelpMeBoardDto[];
    mentors: SearchAllMentorDto[];
  }> {
    const { searchQuery, page } = searchAllBoardsAndMentorsQueryDto;
    const skip = (page - 1) * 10;

    const [helpMeBoards, mentors] =
      await this.searchRepository.searchAllBoardsAndMentors(searchQuery, skip);

    return {
      helpMeBoards: helpMeBoards.map(
        (helpMeBoard) => new SearchAllHelpMeBoardDto(helpMeBoard),
      ),
      mentors: plainToInstance(SearchAllMentorDto, mentors),
    };
  }
}
