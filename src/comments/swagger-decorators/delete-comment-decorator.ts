import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

export function ApiDeleteComment() {
  return applyDecorators(
    ApiOperation({
      summary: '댓글을 삭제하는 API',
      description: '댓글을 삭제하는 API',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 댓글을 삭제한 경우',
      content: {
        JSON: {
          example: {},
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
      status: 403,
      description: '자신이 작성한 댓글이 아닐 경우',
      content: {
        JSON: {
          example: { statusCode: 403, message: '작성한 댓글이 아닙니다.' },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'DB에서 댓글을 찾을 수 없는 경우',
      content: {
        JSON: {
          example: { statusCode: 404, message: '존재하지 않는 댓글입니다.' },
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
      description: '댓글을 삭제하는 오류가 발생한 경우',
      content: {
        JSON: {
          example: {
            statusCode: 500,
            message: '댓글을 삭제하는 중 오류가 발생했습니다.',
          },
        },
      },
    }),
    ApiBearerAuth('access-token'),
    ApiQuery({
      name: 'commentId',
      description: '삭제할 댓글의 ID',
    }),
  );
}
