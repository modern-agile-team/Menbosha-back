import { applyDecorators } from '@nestjs/common';
import { ApiHeaders, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatRoomsDto } from '../dto/chat-rooms.dto';

export function ApiGetChatRooms() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅룸 조회',
      description: 'Header - user-token',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 채팅방 조회',
      type: ChatRoomsDto,
    }),
    ApiHeaders([
      {
        name: 'access_token',
        description: '액세스 토큰',
        required: true,
        example: '여기에 액세스 토큰',
      },
    ]),
  );
}
