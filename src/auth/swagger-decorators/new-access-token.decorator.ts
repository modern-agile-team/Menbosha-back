import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

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
      status: 401,
      description: '우리 서비스의 리프레시 토큰이 아닌 경우',
      content: {
        JSON: {
          example: { statusCode: 401, message: '유효하지 않은 토큰입니다.' },
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: '만료된 리프레시 토큰인 경우',
      content: {
        JSON: {
          example: { statusCode: 403, message: '만료된 토큰입니다.' },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '리프레시 토큰을 DB에서 찾을 수 없는 경우',
      content: {
        JSON: {
          example: { statusCode: 404, message: '토큰을 찾을 수 없습니다.' },
        },
      },
    }),
    ApiResponse({
      status: 411,
      description: '리프레시 토큰이 제공되지 않은 경우',
      content: {
        JSON: {
          example: { statusCode: 411, message: '토큰이 제공되지 않았습니다.' },
        },
      },
    }),
  );
}
