/**
 *
 * @todo swagger 수정
 */
import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiExtraModels,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ReceivedUserDto } from '../dto/received-user.dto';
import { ChatRoomsDto } from '../dto/chat-rooms.dto';

export function ApiCreateChatRoom() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅룸 생성',
      description: 'Header - access-token, Body - received-user-dto',
    }),
    ApiResponse({
      status: 201,
      description: '성공적으로 채팅방 생성',
      type: ChatRoomsDto,
    }),
    ApiConflictResponse({
      description: '해당 유저들의 채팅방이 이미 존재합니다.',
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
    ApiConflictResponse({
      description: '채팅룸 생성 실패.',
      content: {
        JSON: {
          example: {
            message: '채팅룸 생성 실패. 서버에서 에러가 발생했습니다.',
            error: 'Conflict',
            statusCode: 409,
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
    ApiBody({
      type: ReceivedUserDto,
      description: '채팅방 guestId',
      required: true,
    }),
    ApiExtraModels(ReceivedUserDto),
  );
}
