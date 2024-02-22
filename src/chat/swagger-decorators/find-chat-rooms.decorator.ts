import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseFindChatRoomsPaginationDto } from '../dto/response-find-chat-rooms-pagination.dto';

export function ApiFindChatRooms() {
  return applyDecorators(
    ApiOperation({
      summary:
        '챗룸에 유저 정보를 매핑하고 최신의 챗 1개만 가져오도록 하는 api 페이지네이션이 구현됨. 15개씩 잘라서 가져옴.',
      description: 'Header - user-token',
    }),
    ApiResponse({
      status: 200,
      schema: {
        properties: {
          contents: {
            type: 'object',
            $ref: getSchemaPath(ResponseFindChatRoomsPaginationDto),
          },
        },
      },
      description: '성공적으로 채팅방 조회',
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
    ApiNotFoundResponse({
      description: '내 정보를 찾을 수 없는 경우',
      schema: {
        type: 'object',
        example: {
          statusCode: 404,
          message: '사용자를 찾을 수 없습니다.',
          error: 'Not Found',
        },
      },
    }),
    ApiBearerAuth('access-token'),
    ApiExtraModels(ResponseFindChatRoomsPaginationDto),
  );
}
