import { applyDecorators } from '@nestjs/common';
import { ApiHeaders, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetOneChatRoom() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅룸 단일 조회',
      description: 'Header - access_token, Param - roomId',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 채팅방 (단일)조회',
      content: {
        JSON: {
          example: {
            _id: '650bde3798dd4c34439c30dc',
            host_id: 123,
            guest_id: 1234,
            deleted_at: null,
            createdAt: '2023-09-21T06:09:59.724Z',
            updatedAt: '2023-09-21T06:09:59.724Z',
            __v: 0,
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: '유효성 검사 실패',
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
    ApiResponse({
      status: 404,
      description: '채팅룸 조회 실패.',
      content: {
        JSON: {
          example: {
            message: '해당 유저가 속한 채팅방이 없습니다.',
            error: 'Not Found',
            statusCode: 404,
          },
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
