import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function ApiAddMentorBoard() {
  return applyDecorators(
    ApiOperation({
      summary: '멘토보드를 생성하는 API',
      description: '멘토보드를 생성하는 API',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 보드를 생성한 경우',
      content: {
        JSON: {
          example: {
            head: '게시물 제목',
            body: '게시물 내용',
            categoryId: '3(number)',
            userId: '유저 아이디 (number)',
            id: '생성된 보드 id (number)',
            createAt: '2023-10-29T23:45:54.023Z',
            updateAt: '2023-10-29T23:45:54.023Z',
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
      description: '보드를 생성하는 중 오류가 발생한 경우',
      content: {
        JSON: {
          example: {
            statusCode: 500,
            message: '보드를 생성하는 중 오류가 발생했습니다.',
          },
        },
      },
    }),
    ApiBearerAuth('access-token'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          head: { type: 'string' },
          body: { type: 'string' },
          categoryId: { type: 'number' },
        },
        example: {
          head: '게시물 제목',
          body: 'click send to get a response boards.service.ts 30자 넘는 게시물 테스트 중입니다.',
          categoryId: 4,
        },
      },
    }),
  );
}
