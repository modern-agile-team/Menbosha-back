import { applyDecorators } from '@nestjs/common';
import {
  ApiHeaders,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function ApiGetMyInfoWithOwner() {
  return applyDecorators(
    ApiOperation({
      summary: '내 정보 조회 API(owner 여부와 함께)',
      description: '내 정보 조회 API(owner 여부와 함께)',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 내 정보를 조회한 경우',
      content: {
        JSON: {
          example: {
            userId: 1,
            name: '홍길동',
            email: 'abcd@naver.com',
            gender: 'M',
            admin: false,
            provider: 'kakao',
            userImage: 'http://img.jpg',
            owner: false,
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '내 정보를 찾을 수 없는 경우',
      content: {
        JSON: {
          example: {
            statusCode: 404,
            message: '사용자를 찾을 수 없습니다.',
            error: 'Not Found',
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
    ApiParam({ name: 'targetId', example: 1, required: true }),
  );
}
