import { applyDecorators } from '@nestjs/common';
import { ApiHeaders, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetChatNotifications() {
  return applyDecorators(
    ApiOperation({
      summary: `읽지 않은 채팅 알람 미리보기 및 개수(각 채팅룸의 가장 최신의 읽지 않은 메세지 1개와 그 외 읽지 않은 메세지들의 개수(count))
        단순 채팅 조회와 다른 점은 isSeen이 false인 값만 가져오며, count라는 property가 추가 되었고, content의 경우 앞의 10글자만 잘라서 return
        `,
      description: 'Headers - access_token',
    }),
    ApiResponse({
      status: 200,
      description: '채팅 알람 및 개수 받아오기 성공',
      content: {
        JSON: {
          example: [
            {
              _id: '654a397f55108627dc2f01b6',
              chatroom_id: '653383a4468680bc4e9f8492',
              sender: 70,
              receiver: 69,
              content: '허으으으호호호우우우',
              isSeen: false,
              createdAt: '2023-11-07T13:19:59.847Z',
              updatedAt: '2023-11-07T13:19:59.847Z',
              __v: 0,
              count: 2,
            },
            {
              _id: '6541b0596f03ac696504c889',
              chatroom_id: '653383a4468680bc4e9f8491',
              sender: 70,
              receiver: 69,
              content: 'https://ma',
              createdAt: '2023-11-01T01:56:41.232Z',
              updatedAt: '2023-11-01T01:56:41.232Z',
              __v: 0,
              isSeen: false,
              count: 1,
            },
          ],
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
