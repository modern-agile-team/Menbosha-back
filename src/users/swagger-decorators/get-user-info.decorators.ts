import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetUserInfo() {
  return applyDecorators(
    ApiOperation({
      summary: '유저 정보 조회 API',
      description: '유저 정보 조회 API',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 유저 정보를 조회한 경우',
      content: {
        JSON: {
          example: {
            name: '홍길동',
            email: 'abcd@naver.com',
            isMentor: false,
            activityCategoryId: 3,
            phone: 'true',
            image: 'http://img.jpg',
            intro: {
              mainField: 'FPS',
              introduce: '발로란트 1대1 코칭해드려요',
              career: '발로란트 최대 티어 불멸',
            },
            badge: [
              { badgeId: 1, createdAt: '2023-12-12T19:59:18.000Z' },
              { badgeId: 2, createdAt: '2023-12-12T19:59:18.000Z' },
            ],
          },
        },
      },
    }),
  );
}
