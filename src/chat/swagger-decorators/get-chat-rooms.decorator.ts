import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ChatRoomsDto } from '../dto/chat-rooms.dto';

export function ApiGetChatRooms() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅룸 조회',
      description: 'Header - user-token',
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
          data: {
            type: 'array',
            items: {
              $ref: getSchemaPath(ChatRoomsDto),
            },
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
    ApiExtraModels(ChatRoomsDto),
  );
}
