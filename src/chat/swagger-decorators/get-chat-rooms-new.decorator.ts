import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseGetChatRoomsDto } from '../dto/response-get-chat-rooms.dto';

export function ApiGetChatRoomsNew() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅룸 조회 새로운 api',
      description: 'Header - user-token',
    }),
    ApiResponse({
      schema: {
        properties: {
          statusCode: {
            type: 'number',
          },
          data: {
            type: 'array',
            items: {
              $ref: getSchemaPath(ResponseGetChatRoomsDto),
            },
          },
        },
      },
      // type: ResponseGetChatRoomsDto,
      // status: 200,
      description: '성공적으로 채팅방 조회',
    }),
    ApiHeaders([
      {
        name: 'access_token',
        description: '액세스 토큰',
        required: true,
        example: '여기에 액세스 토큰',
      },
    ]),
    ApiExtraModels(ResponseGetChatRoomsDto),
  );
}
