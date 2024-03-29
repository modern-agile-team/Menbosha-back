import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function ApiUploadMentorBoardImages() {
  return applyDecorators(
    ApiOperation({
      summary: '멘토 보드 이미지 업로드 API',
      description: '멘토 보드 이미지 업로드 API',
    }),
    ApiResponse({
      status: 201,
      description: '성공적으로 이미지를 업로드한 경우',
      content: {
        JSON: { example: { message: '이미지 업로드에 성공했습니다.' } },
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
      description: '이미지 업로드 및 처리 중 오류가 발생한 경우',
      content: {
        JSON: {
          example: {
            statusCode: 500,
            message: '이미지 업로드 및 처리 중 오류가 발생했습니다.',
          },
        },
      },
    }),
    ApiBearerAuth('access-token'),
    ApiBody({
      schema: {
        type: 'form-data',
        properties: {
          files: { type: 'file' },
        },
        example: {
          files: '고양이.png',
        },
      },
    }),
  );
}
