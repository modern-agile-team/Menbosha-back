import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiHeaders,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiUnauthorizedResponse,
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
          statusCode: { example: 201, type: 'number' },
          content: {
            type: 'object',
            $ref: getSchemaPath(ChatImageDto),
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: '우리 서비스의 액세스 토큰이 아닌 경우',
      content: {
        JSON: {
          example: { statusCode: 401, message: '유효하지 않은 토큰입니다.' },
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
    ApiForbiddenResponse({
      description: '해당 유저가 채팅방에 속하지 않음. 혹은 토큰 에러',
      content: {
        JSON: {
          example: {
            message: [
              '해당 채팅방에 접근 권한이 없습니다',
              '만료된 토큰입니다.',
            ],
            error: 'Forbidden',
            statusCode: 403,
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description:
        'ObjectId Validation 실패 및 property가 비어 있어서 생긴 오류',
      content: {
        JSON: {
          example: {
            message: [
              '올바른 ObjectId 형식이 아닙니다.',
              'property file should not exist',
              'File buffer is missing in the uploaded file.',
            ],
            error: 'Bad Request',
            statusCode: 400,
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
