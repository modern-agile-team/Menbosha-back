import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ChatRoomDto } from '../dto/chat-room.dto';
import { CreateChatRoomBodyDto } from '../dto/create-chat-room-body.dto';

export function ApiCreateChatRoom() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅룸 생성',
      description: `Header - access-token, Body - CreateChatRoomBodyDto
      만약 기존에 둘의 채팅방이 있고 현재 내가 그 채팅방에 없거나 상대가 없다면(채팅방이 삭제 되지 않았다면)
      기존에 남아있던 둘의 채팅방으로 나를 혹은 상대를 다시 추가함.
      기존의 둘의 채팅방이 없다면 새로 생성.`,
    }),
    ApiResponse({
      status: 201,
      description: '성공적으로 채팅방 생성',
      schema: {
        properties: {
          content: {
            type: 'object',
            $ref: getSchemaPath(ChatRoomDto),
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: '400 error',
      content: {
        JSON: {
          examples: {
            'invalid token': {
              value: { statusCode: 400, message: 'invalid token' },
              description: '유효하지 않은 토큰인 경우',
            },
            'jwt must be provided': {
              value: { statusCode: 400, message: 'jwt must be provided' },
              description: '토큰이 제공되지 않은 경우',
            },
            'validation failed': {
              value: {
                message: [
                  'chatRoomType must be one of the following values: oneOnOne, group',
                  'receiverId must be an integer number',
                  'receiverId must not be less than 1',
                ],
                error: 'Bad Request',
                statusCode: 400,
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: '401 error',
      content: {
        JSON: {
          examples: {
            'invalid signature': {
              value: { statusCode: 401, message: 'invalid signature' },
              description: '우리 서비스의 토큰이 아닌 경우',
            },
            'jwt expired': {
              value: { statusCode: 401, message: 'jwt expired' },
              description: '만료된 토큰인 경우',
            },
          },
        },
      },
    }),
    ApiForbiddenResponse({
      description: '본인과의 채팅방을 생성하려 한 경우',
      content: {
        JSON: {
          example: {
            message: ['본인과 채팅방을 생성할 수 없습니다.'],
            error: 'Forbidden',
            statusCode: 403,
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'DB에서 사용자를 찾을 수 없는 경우',
      content: {
        JSON: {
          example: {
            message: '사용자를 찾을 수 없습니다.',
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
    ApiBearerAuth('access-token'),
    ApiBody({
      type: CreateChatRoomBodyDto,
      description: '채팅 룸 생성 body',
      required: true,
    }),
    ApiExtraModels(CreateChatRoomBodyDto, ChatRoomDto),
  );
}
