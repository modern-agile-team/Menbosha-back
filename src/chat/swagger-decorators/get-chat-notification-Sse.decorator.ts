import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetChatNotificationSse() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅 실시간 SSE 알람(미사용 예정)',
      description: 'listener',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 SSE 연결 및 서버로부터 데이터 수신',
      content: {
        JSON: {
          example: {
            chat_id: '65338d7d1af00cf4e6964491',
            sender: 12345642,
            receiver: 123456427,
            isSeen: false,
            _id: '65338d7d1af00cf4e6964493',
            createdAt: '2023-10-21T08:36:13.290Z',
            updatedAt: '2023-10-21T08:36:13.290Z',
            __v: 0,
          },
        },
      },
    }),
  );
}
