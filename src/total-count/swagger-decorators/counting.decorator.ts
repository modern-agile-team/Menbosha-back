import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export function ApiCounting() {
  return applyDecorators(
    ApiOperation({
      summary: '카운팅 API',
      description:
        '요청 시 Body 필수값(Required): type, action , 선택값(Optional): mentorId',
    }),
    ApiResponse({
      status: 200,
      description: '카운팅 성공',
      content: {
        JSON: {
          example: {
            message: '카운팅 성공',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: '필요한 값이 없거나 잘못된 경우',
      content: {
        JSON: {
          example: {
            statusCode: 400,
            message: 'mentorId가 필요한 요청입니다.',
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: '카운팅 도중 에러가 발생한 경우',
      content: {
        JSON: {
          example: {
            statusCode: 500,
            message: '카운팅 도중 에러가 발생했습니다.',
          },
        },
      },
    }),
    ApiHeaders([
      {
        name: 'access_token',
        description: '액세스 토큰',
        example: '여기에 액세스 토큰',
      },
    ]),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          mentorId: {
            type: 'number',
            example: 1,
          },
          type: {
            type: 'string',
            example: 'countMentorBoardLike',
          },
          action: {
            type: 'string',
            example: 'increment',
          },
        },
      },
    }),
  );
}
