import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseMentorBoardHotPostPaginationDto } from 'src/boards/dto/mentorBoard/response-mentor-board-hot-post-pagination.dto';

export function ApiFindAllHotPostsWithPagination() {
  return applyDecorators(
    ApiOperation({
      summary: '멘토 게시판의 인기 글 pagination',
      description:
        'page및 limit, 정렬할 필드 및 오름차순 내림차순을 클라이언트에게서 받습니다.',
    }),
    ApiResponse({
      status: 200,
      description: '멘토 게시판 인기글 성공적으로 불러옴.',
      schema: {
        properties: {
          content: {
            type: 'object',
            $ref: getSchemaPath(ResponseMentorBoardHotPostPaginationDto),
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
                  'categoryId must be an integer number',
                  'categoryId must not be less than 1',
                  'orderField must be one of the following values: id, userId, head, body, createdAt, updatedAt, categoryId, popularAt',
                  'sortOrder must be one of the following values: DESC, ASC',
                  'page must be an integer number',
                  'page must not be less than 1',
                  'pageSize must not be less than 5',
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
    ApiExtraModels(ResponseMentorBoardHotPostPaginationDto),
  );
}
