import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetPageBoards() {
  return applyDecorators(
    ApiOperation({
      summary: '페이지별 보드 불러오는 API',
      description: '페이지별 보드 불러오는 API',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 보드를 불러왔습니다.',
      content: {
        JSON: {
          example: {
            success: true,
            msg: '페이지별로 보드를 가져왔습니다',
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: '보드를 불러오는 중 오류가 발생한 경우',
      content: {
        JSON: {
          example: {
            statusCode: 500,
            message: '보드를 불러오는 중 오류가 발생했습니다.',
          },
        },
      },
    }),
  );
}
