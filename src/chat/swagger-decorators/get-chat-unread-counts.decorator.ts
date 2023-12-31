import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

export function ApiGetChatUnreadCounts() {
  return applyDecorators(
    ApiOperation({
      summary: '지정한 시간 이후로 읽지 않은 채팅 개수 받아오기',
      description: 'getTime()',
    }),
    ApiResponse({
      status: 200,
      description: '개수 받아오기 성공',
      schema: {
        properties: {
          statusCode: { example: 200, type: 'number' },
          content: {
            type: 'number',
            example: 1,
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '채팅룸 조회 실패',
      content: {
        JSON: {
          example: {
            message: '해당 채팅 룸을 찾지 못했습니다.',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'ObjectId Validation 실패',
      content: {
        JSON: {
          example: {
            message: '올바른 ObjectId 형식이 아닙니다.',
            error: 'Bad Request',
            statusCode: 400,
          },
        },
      },
    }),
    ApiQuery({
      name: 'after',
      type: 'number',
      description:
        'getTime() 메서드를 통해 얻은 number.레퍼런스 링크 https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime',
    }),
    ApiParam({
      name: 'roomId',
      type: 'string',
      format: 'ObjectId',
      description: '채팅 룸 id',
    }),
  );
}
