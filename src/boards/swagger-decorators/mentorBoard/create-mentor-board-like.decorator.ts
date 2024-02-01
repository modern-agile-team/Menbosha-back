import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiConflictResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
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
                message: '본인의 게시글에는 좋아요를 누를 수 없습니다.',
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
    ApiBearerAuth('access-token'),
  );
}
