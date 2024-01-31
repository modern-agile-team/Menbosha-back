import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export function ApiNaverUnlink() {
  return applyDecorators(
    ApiOperation({
      summary: '네이버 회원탈퇴 API',
      description: '네이버 회원탈퇴 API',
    }),
    ApiResponse({
      status: 201,
      description: '성공적으로 회원탈퇴 된 경우',
      content: {
        JSON: { example: { message: '네이버 연동 해제가 완료되었습니다.' } },
      },
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
              description: '우리 서비스의 토큰이 아닌 경우',
            },
            'jwt expired': {
              value: { statusCode: 401, message: 'jwt expired' },
              description: '만료된 토큰인 경우',
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'DB에서 네이버 토큰을 찾을 수 없는 경우',
      content: {
        JSON: {
          example: { statusCode: 404, message: '토큰을 찾을 수 없습니다.' },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: '네이버 회원탈퇴 API에서 오류가 발생한 경우',
      content: {
        JSON: {
          example: {
            statusCode: 500,
            message: '네이버 연결 끊기 중 오류가 발생했습니다.',
          },
        },
      },
    }),
    ApiHeaders([
      {
        name: 'access_token',
        description: '액세스 토큰',
        example: '여기에 액세스 토큰',
      },
    ]),
    ApiBearerAuth('access-token'),
  );
}
