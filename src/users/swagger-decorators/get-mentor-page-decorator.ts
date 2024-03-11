import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

export function ApiGetPageNumberByMentor() {
  return applyDecorators(
    ApiOperation({
      summary: '카테고리 id별 멘토의 페이지 개수 가져오는 API',
      description: '카테고리 id별 페이지 개수, 총 멘토 수',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 멘토의 페이지와 총 멘토 수를 불러온 경우',
      content: {
        JSON: {
          example: {
            total: 'number',
            totalPage: 'number',
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: '서버 에러',
      content: {
        JSON: {
          example: {
            statusCode: 500,
            message: 'DB혹은 서버쪽 에러입니다.',
          },
        },
      },
    }),
    ApiQuery({ name: 'categoryId', type: Number }),
  );
}
