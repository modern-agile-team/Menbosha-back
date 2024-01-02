import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiHeaders,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseGetChatRoomsPaginationDto } from '../dto/response-get-chat-rooms-pagination.dto';

export function ApiGetChatRoomsNew() {
  return applyDecorators(
    ApiOperation({
      summary:
        '챗룸에 유저 정보를 매핑하고 최신의 챗 1개만 가져오도록 하는 api',
      description: 'Header - user-token',
    }),
    ApiResponse({
      status: 200,
      schema: {
        properties: {
          statusCode: {
            example: 200,
            type: 'number',
          },
          content: {
            type: 'object',
            $ref: getSchemaPath(ResponseGetChatRoomsPaginationDto),
          },
        },
      },
      description: '성공적으로 채팅방 조회',
    }),
    ApiResponse({
      status: 401,
      description: '우리 서비스의 액세스 토큰이 아닌 경우',
      content: {
        JSON: {
          example: { statusCode: 401, message: '유효하지 않은 토큰입니다.' },
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: '만료된 액세스 토큰인 경우',
      content: {
        JSON: {
          example: { statusCode: 403, message: '만료된 토큰입니다.' },
        },
      },
    }),
    ApiNotFoundResponse({
      description:
        '내 정보를 찾을 수 없는 경우, 존재하지 않는 페이지를 조회하는 경우',
      schema: {
        type: 'object',
        example: {
          statusCode: 404,
          message: ['사용자를 찾을 수 없습니다.', 'Page Not Found'],
          error: 'Not Found',
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
    ApiExtraModels(ResponseGetChatRoomsPaginationDto),
  );
}
