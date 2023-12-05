import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiHeaders,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function ApiUpdateComment() {
  return applyDecorators(
    ApiOperation({
      summary: '댓글을 수정하는 API',
      description: '댓글을 수정하는 API',
    }),
    ApiResponse({
      status: 200,
      description: '댓글의 내용을 성공적으로 수정한 경우',
      content: {
        JSON: {
          example: {
            id: '댓글 고유 id',
            userId: '댓글 작성한 유저 id',
            boardId: '댓글을 작성한 보드의 id',
            content: '수정수정수정수정수정수정수정',
            createAt: '2023-11-06T20:51:35.573Z',
            user: {
              name: '이승우',
              userImage: {
                id: '유저이미지 고유 id',
                userId: '유저 고유 id',
                imageUrl: '프로필 이미지 url',
              },
            },
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
      description: '댓글 수정중 오류가 발생했습니다',
      content: {
        JSON: {
          example: {
            statusCode: 500,
            message: '댓글 수정 중 오류가 발생했습니다.',
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
    ApiParam({
      name: 'commentId',
      description: '수정할 댓글의 ID',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          content: { type: 'string' },
        },
        example: {
          content: '수정수정수정수정수정수정수정',
        },
      },
    }),
  );
}
