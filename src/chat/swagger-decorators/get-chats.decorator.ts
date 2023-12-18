import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiHeaders,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ChatsDto } from '../dto/chats.dto';

export function ApiGetChats() {
  return applyDecorators(
    ApiOperation({
      summary: '해당 채팅룸 채팅 전체 조회',
      description: 'Param - room-id, Headers - access_token',
    }),
    ApiOkResponse({
      description:
        '성공적으로 채팅방 채팅 조회 및 읽지 않았던 채팅들 isSeen: true로 변경',
      schema: {
        properties: {
          statusCode: { example: 200, type: 'number' },
          data: {
            type: 'array',
            items: {
              $ref: getSchemaPath(ChatsDto),
            },
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
    ApiExtraModels(ChatsDto),
  );
}
