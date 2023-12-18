import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiHeaders,
  ApiNotFoundResponse,
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
      status: 200,
      schema: {
        properties: {
          statusCode: {
            example: 200,
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
      description: '성공적으로 채팅방 조회',
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
