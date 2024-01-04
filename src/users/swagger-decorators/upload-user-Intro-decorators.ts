import { applyDecorators } from '@nestjs/common';
import { ApiHeaders, ApiOperation, ApiResponse } from '@nestjs/swagger';

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
      status: 401,
      description: '우리 서비스의 액세스 토큰이 아닌 경우',
      content: {
        JSON: {
          example: { statusCode: 401, message: '유효하지 않은 토큰입니다.' },
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: '만료된 액세스 토큰인 경우',
      content: {
        JSON: {
          example: { statusCode: 403, message: '만료된 토큰입니다.' },
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
      status: 411,
      description: '액세스 토큰이 제공되지 않은 경우',
      content: {
        JSON: {
          example: { statusCode: 411, message: '토큰이 제공되지 않았습니다.' },
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
        required: true,
        example: '여기에 액세스 토큰',
      },
    ]),
  );
}
