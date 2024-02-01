import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export function ApiDeleteMentorBoardLike() {
  return applyDecorators(
    ApiOperation({
      summary: '멘토 게시판 글 좋아요 삭제',
      description: '멘토 게시판 글에 유저 본인의 좋아요를 삭제',
    }),
    ApiResponse({
      status: 200,
      description: '멘토 게시판 글 좋아요 성공적으로 삭제',
      schema: {
        properties: {
          content: {
            properties: {
              isLike: {
                example: false,
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: '400 error',
      content: {
        JSON: {
          examples: {
            'invalid token': {
              value: { statusCode: 400, message: 'invalid token' },
              description: '유효하지 않은 토큰인 경우',
            },
            'jwt must be provided': {
              value: { statusCode: 400, message: 'jwt must be provided' },
              description: '토큰이 제공되지 않은 경우',
            },
            'validation failed': {
              value: {
                message: [
                  'mentorBoardId must not be less than 1',
                  'mentorBoardId must be an integer number',
                  'mentorBoardLikeId must not be less than 1',
                  'mentorBoardLikeId must be an integer number',
                  'property [허용하지 않은 데이터] should not exist',
                ],
                error: 'Bad Request',
                statusCode: 400,
              },
              description: '유효성 검사 실패',
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: '401 error',
      content: {
        JSON: {
          examples: {
            'invalid signature': {
              value: { statusCode: 401, message: 'invalid signature' },
              description: '우리 서비스의 토큰이 아닌 경우',
            },
            'jwt expired': {
              value: { statusCode: 401, message: 'jwt expired' },
              description: '만료된 토큰인 경우',
            },
          },
        },
      },
    }),
    ApiForbiddenResponse({
      description: '403 error',
      content: {
        JSON: {
          examples: {
            forbidden: {
              value: {
                statusCode: 403,
                message: '해당 좋아요에 권한이 없습니다.',
              },
              description: '좋아요 못누름',
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '게시글을 찾을 수 없는 경우',
      content: {
        JSON: {
          example: {
            statusCode: 404,
            message: ['게시물을 찾을 수 없습니다.'],
          },
        },
      },
    }),
    ApiConflictResponse({
      description: '이미 좋아요가 없는 경우',
      content: {
        JSON: {
          example: {
            message: '이미 좋아요가 없습니다.',
            error: 'Conflict',
            statusCode: 409,
          },
        },
      },
    }),
    ApiBearerAuth('access-token'),
  );
}
