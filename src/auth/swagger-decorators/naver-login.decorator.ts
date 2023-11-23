import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

export function ApiNaverLogin() {
  return applyDecorators(
    ApiOperation({
      summary: '네이버 로그인 API',
      description: '네이버 로그인 API',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 로그인 된 경우 (refresh_token은 쿠키로 전달됨)',
      content: {
        JSON: {
          example: {
            accessToken: '여기에 액세스 토큰',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: '인가코드가 없는 경우',
      content: {
        JSON: {
          example: {
            message: '인가코드가 없습니다.',
            error: 'Bad Request',
            statusCode: 400,
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: '유효하지 않은 인가코드인 경우',
      content: {
        JSON: {
          example: {
            statusCode: 401,
            message: '유효하지 않은 인가코드입니다.',
          },
        },
      },
    }),
    ApiQuery({
      name: 'code',
      description: '네이버 인가코드',
      required: true,
      example: 'aNUgOlLlmyxNehJjqW',
    }),
    ApiQuery({
      name: 'state',
      description: '네이버 인가 요청 시 전달한 상태 토큰',
      required: true,
      example: 'test',
    }),
  );
}
