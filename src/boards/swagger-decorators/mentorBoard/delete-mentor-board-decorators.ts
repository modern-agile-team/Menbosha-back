import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

export function ApiDeleteMentorBoard() {
  return applyDecorators(
    ApiOperation({
      summary: '멘토 게시글 삭제',
      description: 'Header - access-token, Param - board-id',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 게시글 삭제.',
      content: {
        JSON: {
          example: {
            success: true,
            msg: '게시글 삭제 성공',
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
            success: false,
            code: 404,
            data: '존재하지 않는 게시물입니다.',
          },
        },
      },
    }),
    ApiBearerAuth('access-token'),
  );
}
