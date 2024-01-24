import { applyDecorators } from '@nestjs/common';
import { ApiHeaders, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiUpdateUserIntro() {
  return applyDecorators(
    ApiOperation({
      summary: '내 프로필을 수정하는 API',
      description: '내 프로필을 수정하는 API',
    }),
    ApiResponse({
      status: 200,
      description: '내 프로필의 내용을 성공적으로 수정한 경우',
      content: {
        JSON: {
          example: {
            id: 4,
            userId: 24,
            shortIntro: '안녕하세요 박준혁이에요',
            career: '숨쉬기 경력 21년',
            customCategory: '숨잘쉬기',
            detail: '숨을 잘 쉬고 싶으신가요? 제가 알려드리겠습니다.',
            portfolio: 'naver.com',
            sns: 'naver.com',
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
      description: '프로필 수정중 오류가 발생했습니다',
      content: {
        JSON: {
          example: {
            statusCode: 500,
            message: '프로필 수정 중 오류가 발생했습니다.',
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
  );
}
