import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ChatDto } from '@src/chat/dto/chat.dto';

export function ApiFindChatNotificationSse() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅 실시간 SSE 알람(미사용 예정)',
      description: 'listener',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 SSE 연결 및 서버로부터 데이터 수신',
      type: ChatDto,
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
      status: 404,
      description: 'DB에서 사용자를 찾을 수 없는 경우',
      content: {
        JSON: {
          example: { statusCode: 404, message: '사용자를 찾을 수 없습니다.' },
        },
      },
    }),
    ApiBearerAuth('access-token'),
    ApiExtraModels(ChatDto),
  );
}
