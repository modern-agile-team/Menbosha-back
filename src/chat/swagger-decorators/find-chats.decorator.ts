import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AggregateChatRoomForChatsDto } from '../dto/aggregate-chat-room-for-chats.dto';

export function ApiFindChats() {
  return applyDecorators(
    ApiOperation({
      summary: '해당 채팅룸 채팅 전체 조회',
      description: 'Param - room-id, Headers - access_token',
    }),
    ApiOkResponse({
      description:
        '성공적으로 채팅방 채팅 조회 및 읽지 않았던 채팅들 seenUsers에 myId 추가 및 pagination함. 20개씩 잘라서 가져옴.',
      schema: {
        properties: {
          contents: {
            type: 'object',
            $ref: getSchemaPath(AggregateChatRoomForChatsDto),
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
                  'page must not be less than 1',
                  'page must be an integer number',
                  'pageSize must not be less than 5',
                  'pageSize must be an integer number',
                  '올바른 ObjectId 형식이 아닙니다.',
                  'property [허용하지 않은 데이터] should not exist',
                ],
                error: 'Bad Request',
                statusCode: 400,
              },
              description: '유효성 검사 실패',
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
    ApiResponse({
      status: 403,
      description: '해당 채팅방에 접근 권한 없는 경우',
      content: {
        JSON: {
          example: {
            statusCode: 403,
            error: 'Forbidden',
            message: ['해당 채팅방에 접근 권한이 없습니다'],
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
    ApiBearerAuth('access-token'),
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
