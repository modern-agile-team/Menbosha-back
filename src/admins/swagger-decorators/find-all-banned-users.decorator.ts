import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { BannedUsersPaginationResponseDto } from '@src/admins/banned-user/dtos/banned-users-pagination-response.dto';

export const ApiFindAllBannedUsers = () => {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: '밴당한 유저 조회(pagination) api(for admin)',
      description:
        '일단은 기획이 나온게 없고 성능 이슈 때문에 reason은 따로 response에 실어주지 않음.',
      operationId: 'admin_findAll',
    }),

    ApiOkResponse({
      description: '성공적으로 banned user 조회',
      schema: {
        properties: {
          contents: {
            $ref: getSchemaPath(BannedUsersPaginationResponseDto),
          },
        },
      },
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
          },
        },
      },
    }),

    ApiExtraModels(BannedUsersPaginationResponseDto),
  );
};
