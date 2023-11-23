import { applyDecorators } from '@nestjs/common';
import { ApiHeaders, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiCreateChatRoom() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅룸 생성',
      description: 'Header - access-token, Body - received-user-dto',
    }),
    ApiResponse({
      status: 201,
      description: '성공적으로 채팅방 생성',
      content: {
        JSON: {
          example: {
            host_id: 12345642,
            guest_id: 123456427,
            deleted_at: null,
            _id: '653383a4468680bc4e9f8491',
            createdAt: '2023-10-21T07:54:12.343Z',
            updatedAt: '2023-10-21T07:54:12.343Z',
            __v: 0,
          },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: '해당 유저들의 채팅방이 이미 존재합니다.',
      content: {
        JSON: {
          example: {
            message: '해당 유저들의 채팅방이 이미 존재합니다.',
            error: 'Conflict',
            statusCode: 409,
          },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: '채팅룸 생성 실패.',
      content: {
        JSON: {
          example: {
            message: '채팅룸 생성 실패. 서버에서 에러가 발생했습니다.',
            error: 'Conflict',
            statusCode: 409,
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
