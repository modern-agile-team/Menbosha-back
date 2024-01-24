import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiConflictResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function ApiCreateMentorBoardLike() {
  return applyDecorators(
    ApiOperation({
      summary: '멘토 게시판 글 좋아요 생성',
      description: '멘토 게시판 글에 좋아요를 생성합니다.',
    }),
    ApiResponse({
      status: 201,
      description: '멘토 게시판 글 좋아요 생성 성공.',
      schema: {
        properties: {
          content: {
            properties: {
              isLike: {
                example: true,
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
      description:
        'DB에서 사용자를 찾을 수 없는 경우, 게시글을 찾을 수 없는 경우',
      content: {
        JSON: {
          example: {
            statusCode: 404,
            message: [
              '사용자를 찾을 수 없습니다.',
              '게시물을 찾을 수 없습니다.',
            ],
          },
        },
      },
    }),
    ApiConflictResponse({
      description: '이미 좋아요가 있는 경우',
      content: {
        JSON: {
          example: {
            message: '이미 좋아요가 존재합니다.',
            error: 'Conflict',
            statusCode: 409,
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
    ApiBearerAuth('access-token'),
  );
}
