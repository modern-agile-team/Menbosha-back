import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiHeaders,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

export function ApiDeleteChatRoom() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅룸 삭제',
      description: 'Header - access_token, Param - roomId',
    }),
    ApiNoContentResponse({
      description: '성공적으로 채팅방 삭제',
    }),
    ApiBadRequestResponse({
      description: '유효성 검사 실패',
      content: {
        JSON: {
          example: {
            message: '올바른 ObjectId 형식이 아닙니다.',
            error: 'Bad Request',
            statusCode: 400,
          },
        },
      },
    }),
    ApiForbiddenResponse({
      description: '해당 채팅방에 접근 권한이 없습니다',
      content: {
        JSON: {
          example: {
            message: '해당 채팅방에 접근 권한이 없습니다',
            error: 'Forbidden',
            statusCode: 403,
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: '해당 채팅룸이 없습니다.',
      content: {
        JSON: {
          example: {
            message: '해당 채팅룸이 없습니다.',
            error: 'Not Found',
            statusCode: 404,
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
    ApiParam({
      name: 'roomId',
      description: '채팅방의 id',
      required: true,
      type: 'string',
      format: 'objectId',
    }),
  );
}
