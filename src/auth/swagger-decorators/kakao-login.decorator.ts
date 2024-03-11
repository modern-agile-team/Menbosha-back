import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export function ApiKakaoLogin() {
  return applyDecorators(
    ApiOperation({
      summary: '카카오 로그인 API',
      description: '카카오 로그인 API',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 로그인 된 경우 (refresh_token은 쿠키로 전달됨)',
      content: {
        JSON: {
          example: {
            accessToken: '여기에 액세스 토큰',
            refreshToken: '여기에 리프레시 토큰',
            firstLogin: true,
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
      description: '카카오 인가코드',
      required: true,
      example:
        'ksqUzF0XZfE7pz5vcyZ2m0GvdxXkwJ9mlgDDGo1_RPD55vvOeydu-Qx4xNjuz8gnUnUFPAo9cxgAAAGLIusfpw',
    }),
  );
}
