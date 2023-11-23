import { applyDecorators } from '@nestjs/common';
import { ApiHeaders, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiCreateChatImage() {
  return applyDecorators(
    ApiOperation({
      summary:
        '특정 채팅방 이미지 생성. 채팅 이미지 전송 시, 여기서 생성한 이미지 url을 통해 socket으로 채팅 전송 요청',
      description:
        'Headers - access_token, Param - roomId, Formdata - ReceivedUserDto, key: file, value: image.png',
    }),
    ApiResponse({
      status: 201,
      description: '채팅 이미지 url 생성 성공',
      content: {
        JSON: {
          example: {
            chatroom_id: '653383a4468680bc4e9f8492',
            sender: 69,
            receiver: 70,
            content:
              'https://ma6-main.s3.ap-northeast-2.amazonaws.com/ChatImages/69_1699363871042.jpeg',
            isSeen: false,
            _id: '654a3c1f1066329877d1d919',
            createdAt: '2023-11-07T13:31:11.263Z',
            updatedAt: '2023-11-07T13:31:11.263Z',
            __v: 0,
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
    ApiResponse({
      status: 404,
      description: '채팅 이미지 생성 실패.',
      content: {
        JSON: {
          example: {
            message: '채팅을 전송할 유저가 채팅방에 없습니다',
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
