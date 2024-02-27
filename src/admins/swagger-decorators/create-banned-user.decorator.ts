import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { BannedUserDto } from '@src/admins/banned-user/dtos/banned-user.dto';

export const ApiCreateBannedUser = () => {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: '어드민 전용 유저 밴 API',
      description:
        '어드민 권한을 가진 유저만 접근 가능한 API로, 같은 어드민은 밴할 수 없습니다.',
      operationId: 'admin_createBannedUser',
    }),

    ApiCreatedResponse({
      description: `유저를 성공적으로 밴. banned_user 테이블에 로우가 생성됨과 동시에 밴 당한 유저의 status가 inactive 상태로 변경됩니다.
        밴을 당한 유저는 제재가 끝나기 전까지 로그인에 실패합니다.`,
      schema: {
        properties: {
          contents: {
            $ref: getSchemaPath(BannedUserDto),
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
                  'reason must be longer than or equal to 1 characters',
                  'endAt must match /^(?!0000)\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])T(?:2[0-3]|[01]\\d):(?:[0-5]\\d):(?:[0-5]\\d)Z$/ regular expression',
                  'reason must be shorter than or equal to 255 characters',
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
                '어드민에게 접근은 허용되지 않음. 커스텀 에러코드 9002',
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

    ApiExtraModels(BannedUserDto),
  );
};
