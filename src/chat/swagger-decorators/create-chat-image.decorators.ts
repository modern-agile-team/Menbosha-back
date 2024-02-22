import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ChatImageDto } from '../dto/chat-image.dto';

export function ApiCreateChatImage() {
  return applyDecorators(
    ApiOperation({
      summary: '특정 채팅방 이미지 생성.',
      description:
        'Headers - access_token, Param - roomId, FormData - key: file, value: image.png 채팅 이미지 전송 시, 여기서 생성한 이미지 url을 통해 socket으로 채팅 전송 요청',
    }),
    ApiResponse({
      status: 201,
      description: '채팅 이미지 url 생성 성공',
      schema: {
        properties: {
          contents: {
            type: 'object',
            $ref: getSchemaPath(ChatImageDto),
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
                  '올바른 ObjectId 형식이 아닙니다.',
                  'File buffer is missing in the uploaded file.',
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
    ApiForbiddenResponse({
      description: '해당 유저가 채팅방에 속하지 않음.',
      content: {
        JSON: {
          example: {
            message: ['해당 채팅방에 접근 권한이 없습니다'],
            error: 'Forbidden',
            statusCode: 403,
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: '채팅룸 조회 실패, DB에서 사용자를 찾을 수 없는 경우',
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
      status: 500,
      description: '이미지 업로드 및 처리 중 오류가 발생한 경우',
      content: {
        JSON: {
          example: {
            statusCode: 500,
            message: '이미지 업로드 및 처리 중 오류가 발생했습니다.',
          },
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
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    ApiExtraModels(ChatImageDto),
  );
}
