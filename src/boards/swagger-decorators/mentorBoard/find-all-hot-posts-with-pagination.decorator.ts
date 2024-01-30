import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { MentorBoardHotPostPaginationResponseDto } from 'src/boards/dto/mentorBoard/mentor-board-hot-post-pagination-response.dto';

export function ApiFindAllHotPostsWithPagination() {
  return applyDecorators(
    ApiOperation({
      summary: '멘토 게시판의 인기 글 pagination',
      description: `page및 limit, 정렬할 필드, 오름차순 내림차순, 필터링할 필드를 클라이언트에게서 받습니다. 
         head 및 body 필터링의 경우에 둘 다 값을 넣어주면 둘의 조건을 모두 만족하는 결과값을 반환합니다`,
    }),
    ApiResponse({
      status: 200,
      description: '멘토 게시판 인기글 성공적으로 불러옴.',
      schema: {
        properties: {
          content: {
            type: 'object',
            $ref: getSchemaPath(MentorBoardHotPostPaginationResponseDto),
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
    ApiExtraModels(MentorBoardHotPostPaginationResponseDto),
  );
}
