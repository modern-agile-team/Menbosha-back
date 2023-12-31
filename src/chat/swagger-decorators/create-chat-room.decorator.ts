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
import { ReceivedUserDto } from '../dto/received-user.dto';
import { ChatRoomDto } from '../dto/chat-room.dto';

export function ApiCreateChatRoom() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅룸 생성',
      description: 'Header - access-token, Body - received-user-dto',
    }),
    ApiResponse({
      status: 201,
      description: '성공적으로 채팅방 생성',
      schema: {
        properties: {
          statusCode: { example: 201, type: 'number' },
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
      description: '토큰 만료 에러',
      content: {
        JSON: {
          example: {
            message: '만료된 토큰입니다.',
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
            message: [
              '해당 유저들의 채팅방이 이미 존재합니다.',
              '채팅룸 생성 실패. 서버에서 에러가 발생했습니다.',
            ],
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
      type: ReceivedUserDto,
      description: '채팅방 guestId',
      required: true,
    }),
    ApiExtraModels(ReceivedUserDto, ChatRoomDto),
  );
}
