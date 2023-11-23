import { applyDecorators } from '@nestjs/common';
import { ApiHeaders, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetChats() {
  return applyDecorators(
    ApiOperation({
      summary: '해당 채팅룸 채팅 전체 조회',
      description: 'Param - room-id, Headers - access_token',
    }),
    ApiResponse({
      status: 200,
      description:
        '성공적으로 채팅방 채팅 조회 및 읽지 않았던 채팅들 isSeen: true로 변경',
      content: {
        JSON: {
          example: [
            {
              _id: '654a1b3a88ad1cdd55124710',
              chatroom_id: '653383a4468680bc4e9f8492',
              sender: 70,
              receiver: 69,
              content: '으아아아이 테스트테스트으아으아으앙',
              isSeen: true,
              createdAt: '2023-11-07T11:10:50.817Z',
              updatedAt: '2023-11-07T11:11:13.830Z',
              __v: 0,
            },
            {
              _id: '654a1d106770906a7a5d6274',
              chatroom_id: '653383a4468680bc4e9f8492',
              sender: 70,
              receiver: 69,
              content: '으아아아삼 테스트테스트으아으아으앙',
              isSeen: true,
              createdAt: '2023-11-07T11:18:40.425Z',
              updatedAt: '2023-11-07T11:18:52.075Z',
              __v: 0,
            },
          ],
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
      description: '채팅 조회 실패',
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
