import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { SearchAllHelpMeBoardDto } from '@src/search/dtos/search-all-help-me-board.dto';
import { SearchAllMentorDto } from '@src/search/dtos/search-all-mentor.dto';

export function ApiSearchAllBoardsAndMentors() {
  return applyDecorators(
    ApiOperation({
      summary: '도와주세요 게시판 및 멘토 유저 검색 API',
      description: `도와주세요 게시판의 제목, 본문, 작성자 이름 및 멘토 유저의 이름을 검색합니다.`,
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 검색',
      schema: {
        properties: {
          statusCode: {
            example: 200,
            type: 'number',
          },
          contents: {
            type: 'object',
            properties: {
              helpMeBoards: {
                type: 'array',
                items: {
                  $ref: getSchemaPath(SearchAllHelpMeBoardDto),
                },
              },
              mentors: {
                type: 'array',
                items: {
                  $ref: getSchemaPath(SearchAllMentorDto),
                },
              },
            },
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: '페이지 최소값 및 검색어 길이 불충족',
      content: {
        JSON: {
          example: {
            message: [
              'page must not be less than 1',
              'pageSize must not be less than 1',
              'searchQuery must be longer than or equal to 2 characters',
            ],
            error: 'Bad Request',
            statusCode: 400,
          },
        },
      },
    }),
    ApiExtraModels(SearchAllHelpMeBoardDto, SearchAllMentorDto),
  );
}
