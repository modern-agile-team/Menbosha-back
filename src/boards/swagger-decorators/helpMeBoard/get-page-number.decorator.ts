import { applyDecorators } from '@nestjs/common';
import { ApiHeaders, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetPageNumberByHelpMeBoard() {
  return applyDecorators(
    ApiOperation({
      summary: '멘티 보드의 페이지 개수 가져오는 API',
      description: '페이지 개수, 총 게시글 수',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 멘티보드를 불러온 경우',
      content: {
        JSON: { example: { message: '멘티보드를 성공적으로 불러왔습니다.' } },
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
    ApiHeaders([
      {
        name: 'access_token',
        description: '액세스 토큰(없어도 동작합니다)',
        required: true,
        example: '여기에 액세스 토큰',
      },
    ]),
  );
}
