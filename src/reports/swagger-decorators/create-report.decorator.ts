import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOperation,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ReportDto } from 'src/reports/dto/report.dto';

export function ApiCreateReportDecorator(): MethodDecorator {
  return applyDecorators(
    ApiBearerAuth(),

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
          },
        },
      },
    }),

    ApiUnauthorizedResponse({
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
          },
        },
      },
    }),

    ApiExtraModels(ReportDto),
  );
}
