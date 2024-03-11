import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export function ApiPostUserIntro() {
  return applyDecorators(
    ApiOperation({
      summary: '유저 인트로 업로드 API',
      description: '유저 인트로 업로드 API',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 인트로를 등록한 경우',
      content: {
        JSON: {
          example: {
            mainField: '내이름은 코난 탐정이죠~',
            introduce: '백엔드 공부하고있습니다',
            career: '모던 애자일 6기',
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
      description: 'DB에서 사용자를 찾을 수 없는 경우',
      content: {
        JSON: {
          example: { statusCode: 404, message: '사용자를 찾을 수 없습니다.' },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'DB혹은 서버에서 오류가 발생한 경우',
      content: {
        JSON: {
          example: {
            statusCode: 500,
            message: 'DB혹은 서버에서 오류가 발생했습니다.',
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
