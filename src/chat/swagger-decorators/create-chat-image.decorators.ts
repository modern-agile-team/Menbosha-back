import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiHeaders,
  ApiOperation,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ChatImagesDto } from '../dto/chat-images.dto';

export function ApiCreateChatImage() {
  return applyDecorators(
    ApiOperation({
      summary: '특정 채팅방 이미지 생성.',
      description:
        'Headers - access_token, Param - roomId, FormData - ReceivedUserDto, key: file, value: image.png 채팅 이미지 전송 시, 여기서 생성한 이미지 url을 통해 socket으로 채팅 전송 요청',
    }),
    ApiResponse({
      status: 201,
      description: '채팅 이미지 url 생성 성공',
      schema: {
        properties: {
          statusCode: { example: 201, type: 'number' },
          data: {
            type: 'object',
            $ref: getSchemaPath(ChatImagesDto),
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '채팅룸 조회 실패',
      content: {
        JSON: {
          example: {
            message: '해당 채팅방이 없습니다.',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      },
    }),
    ApiForbiddenResponse({
      status: 403,
      description: '해당 유저가 채팅방에 속하지 않음.',
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
    ApiResponse({
      status: 400,
      description:
        'ObjectId Validation 실패 및 property가 비어 있어서 생긴 오류',
      content: {
        JSON: {
          example: {
            message: [
              '올바른 ObjectId 형식이 아닙니다.',
              'property file should not exist',
            ],
            error: 'Bad Request',
            statusCode: 400,
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
          receiverId: { type: 'integer' },
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    ApiExtraModels(ChatImagesDto),
  );
}
