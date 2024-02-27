import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiDeleteReport = () => {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: '신고 삭제 (for admin)',
      operationId: 'admin_deleteReport',
    }),

    ApiNoContentResponse({
      description: '성공적으로 신고 삭제',
    }),

    ApiBadRequestResponse({
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
            'validation failed': {
              value: {
                message: ['string'],
                error: 'Bad Request',
                statusCode: 400,
              },
              description: '유효성 검사 실패',
            },
          },
        },
      },
    }),

    ApiUnauthorizedResponse({
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
          },
        },
      },
    }),

    ApiForbiddenResponse({
      description: '403 error',
      content: {
        JSON: {
          examples: {
            ADMIN_ONLY_ACCESS: {
              value: {
                timestamp: '2024-02-23T16:22:40.289Z',
                statusCode: 403,
                code: 9001,
                message: 'Access to this API is restricted to admins only.',
              },
              description: '어드민 외에 접근 불가능. 커스텀 에러코드 9001',
            },
          },
        },
      },
    }),

    ApiNotFoundResponse({
      description: '404 error',
      content: {
        JSON: {
          examples: {
            'user not found': {
              value: {
                message: '해당 유저를 찾지 못했습니다.',
                error: 'Not Found',
                statusCode: 404,
              },
            },
            'banned user not found': {
              value: {
                message: '해당 신고 정보를 찾지 못했습니다',
                error: 'Not Found',
                statusCode: 404,
              },
            },
          },
        },
      },
    }),
  );
};
