import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiPullingUpHelpMeBoard() {
  return applyDecorators(
    ApiOperation({
      summary: '도와주세요 게시글을 끌어올리는 API',
      description: '도와주세요 게시글을 끌어올리는 API',
    }),
    ApiResponse({
      status: 200,
      description: '게시판을 성공적으로 끌어올린 경우',
      content: {
        JSON: {
          example: '끌어올리기가 완료되었습니다.',
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
      description: 'DB에서 일치하는 보드를 찾을 수 없는 경우',
      content: {
        JSON: {
          example: { statusCode: 404, message: '보드를 찾을 수 없습니다.' },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '사용자가 작성한 게시물이 아닐 경우',
      content: {
        JSON: {
          example: {
            statusCode: 404,
            message: '사용자가 작성한 게시물이 아닙니다.',
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
      description: 'DB혹은 서버 오류입니다.',
      content: {
        JSON: {
          example: {
            statusCode: 500,
            message: 'DB혹은 서버 오류입니다.',
          },
        },
      },
    }),
    ApiBearerAuth('access-token'),
  );
}
