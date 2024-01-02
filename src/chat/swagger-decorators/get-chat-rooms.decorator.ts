import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiHeaders,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ChatRoomsWithoutChatsItemDto } from '../dto/chat-rooms-without-chats-item.dto';

export function ApiGetChatRooms() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅룸 조회',
      description: 'Header - user-token chats 없이 불러옴',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 채팅방 조회',
      schema: {
        properties: {
          statusCode: {
            example: 200,
            type: 'number',
          },
          content: {
            type: 'array',
            items: {
              $ref: getSchemaPath(ChatRoomsWithoutChatsItemDto),
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
    ApiNotFoundResponse({
      description: '내 정보를 찾을 수 없는 경우',
      schema: {
        type: 'object',
        example: {
          statusCode: 404,
          message: '사용자를 찾을 수 없습니다.',
          error: 'Not Found',
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
    ApiExtraModels(ChatRoomsWithoutChatsItemDto),
  );
}
