import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { HelpYouCommentPaginationResponseDto } from '@src/comments/dto/help-you-comment-pagination-response.dto';

export function ApiFindAllHelpYouComments() {
  return applyDecorators(
    ApiOperation({
      summary: '도와줄게요 댓글 pagination',
      description: `page및 limit, 정렬할 필드, 오름차순 내림차순, 필터링할 필드를 클라이언트에게서 받습니다.`,
    }),
    ApiBearerAuth('access-token'),
    ApiResponse({
      status: 200,
      description: '도와줄게요 댓글 성공적으로 불러옴.',
      schema: {
        properties: {
          contents: {
            type: 'object',
            $ref: getSchemaPath(HelpYouCommentPaginationResponseDto),
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
            'validation failed': {
              value: {
                message: [
                  'id must be an integer number',
                  'id must not be less than 1',
                  'userId must be an integer number',
                  'userId must not be less than 1',
                  'orderField must be one of the following values: id, userId, createdAt',
                  'sortOrder must be one of the following values: DESC, ASC',
                  'page must be an integer number',
                  'page must not be less than 1',
                  'pageSize must not be less than 1',
                  'pageSize must be an integer number',
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
    ApiNotFoundResponse({
      description: '404 Error',
      content: {
        JSON: {
          examples: {
            'Not Found help me board': {
              value: {
                message: ['해당 게시글이 존재하지 않습니다.'],
                error: 'Not Found',
                statusCode: 404,
              },
              description: '도와주세요 게시글 찾지 못함',
            },
          },
        },
      },
    }),
    ApiExtraModels(HelpYouCommentPaginationResponseDto),
  );
}
