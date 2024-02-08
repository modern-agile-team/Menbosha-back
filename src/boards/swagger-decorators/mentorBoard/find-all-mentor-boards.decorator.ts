import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { MentorBoardPaginationResponseDto } from 'src/boards/dto/mentorBoard/mentor-board-pagination-response.dto';

export function ApiFindAllMentorBoards() {
  return applyDecorators(
    ApiOperation({
      summary: '멘토 게시판 글 pagination',
      description: `page및 limit, 정렬할 필드, 오름차순 내림차순, 필터링할 필드를 클라이언트에게서 받습니다. 
         head 및 body 필터링의 경우에 둘 다 값을 넣어주면 둘의 조건을 모두 만족하는 결과값을 반환합니다`,
    }),
    ApiResponse({
      status: 200,
      description: '멘토 게시판 글 성공적으로 불러옴.',
      schema: {
        properties: {
          content: {
            type: 'object',
            $ref: getSchemaPath(MentorBoardPaginationResponseDto),
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: '400 error',
      content: {
        JSON: {
          examples: {
            'validation failed': {
              value: {
                message: [
                  'id must be an integer number',
                  'id must not be less than 1',
                  'userId must be an integer number',
                  'userId must not be less than 1',
                  'categoryId must be an integer number',
                  'categoryId must not be less than 1',
                  'loadOnlyPopular must be a boolean',
                  'orderField must be one of the following values: id, userId, head, body, createdAt, updatedAt, categoryId, popularAt',
                  'sortOrder must be one of the following values: DESC, ASC',
                  'page must be an integer number',
                  'page must not be less than 1',
                  'pageSize must not be less than 1',
                  'pageSize must be an integer number',
                  'property [허용하지 않은 데이터] should not exist',
                ],
                error: 'Bad Request',
                statusCode: 400,
              },
              description: '유효성 검사 실패',
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: '404 Error',
      content: {
        JSON: {
          examples: {
            'Not Found category Id': {
              value: {
                message: ['해당 category id가 존재하지 않습니다.'],
                error: 'Not Found',
                statusCode: 404,
              },
              description: '카테고리 id 못찾음',
            },
          },
        },
      },
    }),
    ApiExtraModels(MentorBoardPaginationResponseDto),
  );
}
