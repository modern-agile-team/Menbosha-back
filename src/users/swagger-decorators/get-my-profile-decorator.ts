import { applyDecorators } from '@nestjs/common';
import { ApiHeaders, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetMyProfile() {
  return applyDecorators(
    ApiOperation({
      summary: '내 프로필 조회 API',
      description: '내 프로필 조회 API',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 내 프로필을 조회한 경우',
      content: {
        JSON: {
          example: {
            id: 1,
            name: '홍길동',
            email: 'abcd@naver.com',
            isMentor: false,
            hopeCategoryId: 3,
            activityCategoryId: 3,
            rank: 10,
            phone: 'true',
            image: 'http://img.jpg',
            intro: {
              mainField: '응애',
              introduce: '발로란트 1대1 코칭해드려요',
              career: '발로란트 최대 티어 불멸',
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '내 프로필을 찾을 수 없는 경우',
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
  );
}
