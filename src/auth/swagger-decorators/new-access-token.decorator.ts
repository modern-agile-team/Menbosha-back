import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export function ApiNewAccessToken() {
  return applyDecorators(
    ApiOperation({
      summary: '액세스 토큰 재발급 API',
      description:
        '다른 API 요청에서 403 에러가 발생된 경우 이 API로 액세스 토큰을 재발급 받아주세요.',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 액세스 토큰을 재발급 받은 경우',
      content: { JSON: { example: { accessToken: '여기에 액세스 토큰' } } },
    }),
    ApiResponse({
      status: 400,
      description: '400 error',
      content: {
        JSON: {
          examples: {
            'invalid token': {
              value: { statusCode: 400, message: 'invalid token' },
              description: '유효하지 않은 토큰인 경우',
            },
            'jwt must be provided': {
              value: { statusCode: 400, message: 'jwt must be provided' },
              description: '토큰이 제공되지 않은 경우',
            },
            'jwt error': {
              value: { statusCode: 400, message: 'jwt error' },
              description: '그 외 에러 (백엔드에 도움 요청하기)',
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: '401 error',
      content: {
        JSON: {
          examples: {
            'invalid signature': {
              value: { statusCode: 401, message: 'invalid signature' },
              description: '우리 서비스의 액세스 토큰이 아닌 경우',
            },
            'jwt expired': {
              value: { statusCode: 401, message: 'jwt expired' },
              description: '만료된 토큰인 경우',
            },
            'token not found in redis': {
              value: {
                statusCode: 401,
                message: 'token not found in redis',
              },
              description: '리프레시 토큰이 Redis에 없는 경우',
            },
          },
        },
      },
    }),
    ApiHeaders([
      {
        name: 'refresh_token',
        description: '리프레시 토큰',
        example: '여기에 리프레시 토큰',
      },
    ]),
    ApiCookieAuth('refresh-token'),
  );
}
