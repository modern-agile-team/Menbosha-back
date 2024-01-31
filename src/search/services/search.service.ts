import { Injectable } from '@nestjs/common';
import { SearchRepository } from '../repositories/search.repository';
import { SearchAllPageSizeDto } from '../dtos/search-all-page-size.dto';
import { plainToInstance } from 'class-transformer';
import { SearchAllBoardsAndMentorsQueryDto } from '../dtos/search-all-boards-and-mentors-query.dto';
import { SearchAllHelpMeBoardDto } from '../dtos/search-all-help-me-board.dto';
import { SearchAllMentorDto } from '../dtos/search-all-mentor.dto';

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
