import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function ApiUpdateMentorBoardImage() {
  return applyDecorators(
    ApiOperation({
      summary: '멘토게시판의 이미지를 수정하는 API',
      description: '멘토게시판의 이미지를 수정하는 API',
    }),
    ApiResponse({
      status: 200,
      description: '보드의 내용을 성공적으로 수정한 경우',
      content: {
        JSON: {
          example: {
            message: '이미지 업데이트 및 삭제가 성공적으로 처리되었습니다.',
            newImagesArray: [
              {
                boardId: '업데이트된 보드 아이디',
                imageUrl: '새롭게 넣은 이미지 url',
                id: '새롭게 넣은 이미지 id',
              },
            ],
          },
        },
      },
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
    ApiResponse({
      status: 404,
      description: 'DB에서 사용자를 찾을 수 없는 경우',
      content: {
        JSON: {
          example: { statusCode: 404, message: '사용자를 찾을 수 없습니다.' },
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
      description: '보드 수정중 오류가 발생했습니다',
      content: {
        JSON: {
          example: {
            statusCode: 500,
            message: '보드 수정 중 오류가 발생했습니다.',
          },
        },
      },
    }),
    ApiBearerAuth('access-token'),
    ApiParam({ name: 'mentorBoardId', example: 1 }),
    ApiBody({
      schema: {
        type: 'form-data',
        properties: {
          files: { type: 'file' },
        },
        example: {
          files: '고양이.png',
        },
      },
    }),
  );
}
