import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiHeaders,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
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
    ApiUnauthorizedResponse({
      description: '우리 서비스의 액세스 토큰이 아닌 경우',
      content: {
        JSON: {
          example: { statusCode: 401, message: '유효하지 않은 토큰입니다.' },
        },
      },
    }),
    ApiForbiddenResponse({
      description: '토큰 만료 에러 혹은 본인과의 채팅방을 생성하려 한 경우',
      content: {
        JSON: {
          example: {
            message: [
              '만료된 토큰입니다.',
              '본인과 채팅방을 생성할 수 없습니다.',
            ],
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
    ApiConflictResponse({
      description: '해당 유저들의 채팅방이 이미 존재 및 서버에서 중복에러 발생',
      content: {
        JSON: {
          example: {
            message: '해당 유저들의 채팅방이 이미 존재합니다.',
            error: 'Conflict',
            statusCode: 409,
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
    ApiBody({
      type: CreateChatRoomBodyDto,
      description: '채팅 룸 생성 body',
      required: true,
    }),
    ApiExtraModels(CreateChatRoomBodyDto, ChatRoomDto),
  );
}
