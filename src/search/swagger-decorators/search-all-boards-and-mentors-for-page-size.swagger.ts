import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { SearchAllPageSizeDto } from '../dtos/search-all-page-size.dto';

export function ApiSearchAllBoardsAndMentorsForPageSize() {
  return applyDecorators(
    ApiOperation({
      summary: '도와주세요 게시판 및 멘토 유저 검색 결과 페이지 사이즈',
      description: `도와주세요 게시판의 제목, 본문, 작성자 이름 및 멘토 유저의 이름을 검색하고 page의 최대 크기를 return 합니다.`,
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 검색',
      schema: {
        properties: {
          statusCode: {
            type: 'number',
            example: 200,
          },
          contents: {
            $ref: getSchemaPath(SearchAllPageSizeDto),
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: '검색어 길이 불충족',
      content: {
        JSON: {
          example: {
            message: [
              'searchQuery must be longer than or equal to 2 characters',
            ],
            error: 'Bad Request',
            statusCode: 400,
          },
        },
      },
    }),
    ApiExtraModels(SearchAllPageSizeDto),
  );
}
