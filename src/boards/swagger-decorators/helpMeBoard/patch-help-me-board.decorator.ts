import { applyDecorators } from '@nestjs/common';
import {
  ApiHeaders,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

export function ApiUpdateHelpMeBoard() {
  return applyDecorators(
    ApiOperation({
      summary: '멘티 게시판을 수정하는 API',
      description: '멘티 게시판을 수정하는 API',
    }),
    ApiResponse({
      status: 200,
      description: '게시판의 내용을 성공적으로 수정한 경우',
      content: {
        JSON: {
          example: {
            id: '8',
            head: '제목',
            body: '내용',
            createdAt: '2023-12-06T23:51:47.969Z',
            updatedAt: '2023-12-06T23:51:47.969Z',
            categoryId: 4,
            user: {
              name: '홍길동',
              userImage: {
                id: 'image pk키 (number)',
                userId: '유저 아이디 (number)',
                imageUrl: '이미지 url(string)',
              },
            },
            unitowner: 'bollean값',
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
      description: '보드 수정중 오류가 발생했습니다',
      content: {
        JSON: {
          example: {
            statusCode: 500,
            message: '보드 수정 중 오류가 발생했습니다.',
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
