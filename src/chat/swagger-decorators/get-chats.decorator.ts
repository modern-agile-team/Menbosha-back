import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiHeaders,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AggregateChatRoomForChatsDto } from '../dto/aggregate-chat-room-for-chats.dto';

export function ApiGetChats() {
  return applyDecorators(
    ApiOperation({
      summary: '해당 채팅룸 채팅 전체 조회',
      description: 'Param - room-id, Headers - access_token',
    }),
    ApiOkResponse({
      description:
        '성공적으로 채팅방 채팅 조회 및 읽지 않았던 채팅들 seenUsers에 myId 추가 및 pagination',
      schema: {
        properties: {
          statusCode: { example: 200, type: 'number' },
          content: {
            type: 'object',
            $ref: getSchemaPath(AggregateChatRoomForChatsDto),
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
      description:
        '만료된 액세스 토큰인 경우, 해당 채팅방에 접근 권한 없는 경우',
      content: {
        JSON: {
          example: {
            statusCode: 403,
            error: 'Forbidden',
            message: [
              '만료된 토큰입니다.',
              '해당 채팅방에 접근 권한이 없습니다',
            ],
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '채팅 조회 실패 및 유저 찾기 실패',
      content: {
        JSON: {
          example: {
            message: ['해당 채팅방이 없습니다.', '사용자를 찾을 수 없습니다.'],
            error: 'Not Found',
            statusCode: 404,
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
    ApiParam({
      name: 'roomId',
      description: '채팅방의 id',
      required: true,
      type: 'string',
      format: 'objectId',
    }),
    ApiExtraModels(AggregateChatRoomForChatsDto),
  );
}
