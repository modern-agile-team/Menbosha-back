import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ReportDto } from '@src/reports/dto/report.dto';

export function ApiCreateReportDecorator(): MethodDecorator {
  return applyDecorators(
    ApiBearerAuth('access-token'),

    ApiOperation({
      operationId: 'report_create',
      summary: 'report 생성',
    }),

    ApiCreatedResponse({
      description: 'report 생성 완료',
      schema: {
        properties: {
          contents: { $ref: getSchemaPath(ReportDto) },
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
                  'type must be one of the following values: 증오발언 및 혐오표현 게시글, 불법성 게시글 및 불법 촬영물, 홍보성 게시글',
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

    ApiExtraModels(ReportDto),
  );
}
