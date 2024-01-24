import { applyDecorators } from '@nestjs/common';
import {
  ApiHeaders,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function ApiLeaveChatRoom() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅룸 나가기',
      description: `Header - access_token, Param - roomId
      채팅방 인원 중 한명만 나가면 남은 인원만 있는 채로 채팅방이 존재.
      만약 채팅방을 둘다 나가서 채팅방에 남아있는 인원이 없는 경우 채팅방 삭제 처리`,
    }),
    ApiNoContentResponse({
      description: '성공적으로 채팅방 나가기',
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
      description: ' 해당 채팅방에 접근 권한 없는 경우',
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
            message: ['해당 채팅룸이 없습니다.', '사용자를 찾을 수 없습니다.'],
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
