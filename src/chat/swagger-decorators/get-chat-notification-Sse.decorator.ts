import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ChatsDto } from '../dto/chat.dto';

export function ApiGetChatNotificationSse() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅 실시간 SSE 알람(미사용 예정)',
      description: 'listener',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 SSE 연결 및 서버로부터 데이터 수신',
      type: ChatsDto,
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
