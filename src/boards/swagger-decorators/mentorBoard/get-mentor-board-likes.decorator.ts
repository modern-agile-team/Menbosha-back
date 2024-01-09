import { applyDecorators } from '@nestjs/common';
import { ApiHeaders, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetMentorBoardLikes() {
  return applyDecorators(
    ApiOperation({
      summary: '멘토 게시판 글 좋아요 개수 불러오기',
      description:
        '멘토 게시판 글 좋아요의 개수를 불러오고 좋아요를 눌렀는지 여부를 return 합니다',
    }),
    ApiResponse({
      status: 200,
      description: '멘토 게시판 글 좋아요 성공적으로 불러옴',
      schema: {
        properties: {
          content: {
            properties: {
              isLike: {
                type: 'boolean',
              },
              boardLikesCount: {
                type: 'number',
                default: 0,
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
    ApiResponse({
      status: 411,
      description: '액세스 토큰이 제공되지 않은 경우',
      content: {
        JSON: {
          example: { statusCode: 411, message: '토큰이 제공되지 않았습니다.' },
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
  );
}