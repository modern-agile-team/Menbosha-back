import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetPageNumberByMentorBoard() {
  return applyDecorators(
    ApiOperation({
      summary: '멘토 보드의 페이지 개수 가져오는 API',
      description: '페이지 개수, 총 게시글 수',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 멘토보드를 불러온 경우',
      content: {
        JSON: { example: { message: '멘토보드를 성공적으로 불러왔습니다.' } },
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
  );
}
