import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ChatRoomDto } from '../dto/chat-room.dto';

export function ApiFindOneChatRoom() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅룸 단일 조회',
      description: 'Param - roomId',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 채팅방 (단일)조회',
      schema: {
        properties: {
          contents: {
            type: 'object',
            $ref: getSchemaPath(ChatRoomDto),
          },
        },
      },
    }),
    ApiBadRequestResponse({
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
    ApiNotFoundResponse({
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
    ApiParam({
      name: 'roomId',
      description: '채팅방의 id',
      required: true,
      type: 'string',
      format: 'ObjectId',
    }),
    ApiExtraModels(ChatRoomDto),
  );
}
