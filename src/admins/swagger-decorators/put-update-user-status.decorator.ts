import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserResponseForAdminDto } from 'src/admins/dtos/user-response-for-admin.dto';

export const ApiPutUpdateUserStatus = () => {
  return applyDecorators(
    ApiOperation({
      summary: '어드민 전용 유저 상태 변경 API',
      description:
        '유저의 상태 임의로 변경 가능(active(활성화), inactive(비활성화))',
      operationId: 'admin_putUpdateUserStatus',
    }),

    ApiBearerAuth('access-token'),

    ApiOkResponse({
      description: '유저 status 업데이트 성공',
      schema: {
        properties: {
          contents: {
            $ref: getSchemaPath(UserResponseForAdminDto),
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
                message: [
                  'status must be one of the following values: active, inactive',
                ],
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
            DENIED_FOR_ADMINS: {
              value: {
                timestamp: '2024-02-23T16:25:04.001Z',
                statusCode: 403,
                code: 9002,
                message: 'Access to admins is not allowed.',
              },
              description:
                '어드민에게 접근은 허용되지 않음(본인 수정 제외). 커스텀 에러코드 9002',
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
              description: '대상 유저를 찾지 못함.',
            },
          },
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: '500 error',
      content: {
        JSON: {
          examples: {
            'internal server error': {
              value: {
                message: '유저 업데이트 중 서버 에러 발생',
                error: 'Internal Server Error',
                statusCode: 500,
              },
            },
          },
        },
      },
    }),

    ApiExtraModels(UserResponseForAdminDto),
  );
};
