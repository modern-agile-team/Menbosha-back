import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

export function ApiAddHelpComment() {
  return applyDecorators(
    ApiOperation({
      summary: '도와줄게요 댓글을 생성하는 API',
      description: '도와줄게요 댓글을 생성하는 API',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 댓글을 생성한 경우',
      content: {
        JSON: {
          example: {
            content: '댓글 1차시도',
            userId: '작성한 userId가 넘어옵니다',
            boardId: '작성한 보드의 boardId가 넘어옵니다',
            id: '댓글 고유 id',
            createAt: '작성한 시간이 넘어옵니다',
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
      description: 'DB에서 보드를 찾을 수 없는 경우',
      content: {
        JSON: {
          example: { statusCode: 404, message: '보드를 찾을 수 없습니다.' },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: '이미 게시물에 댓글을 작성한 경우',
      content: {
        JSON: {
          example: {
            statusCode: 409,
            message: '이미 댓글을 남긴 게시물입니다.',
          },
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
      description: '댓글을 생성하는 중 오류가 발생한 경우',
      content: {
        JSON: {
          example: {
            statusCode: 500,
            message: '댓글을 생성하는 중 오류가 발생했습니다.',
          },
        },
      },
    }),
    ApiBearerAuth('access-token'),
    ApiQuery({
      name: 'helpMeBoardId',
      description: '댓글을 추가할 보드의 ID',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          content: { type: 'string' },
        },
        example: {
          content: '추가할 댓글 입력입니다.',
        },
      },
    }),
  );
}
