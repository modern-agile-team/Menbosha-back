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
            id: 24,
            name: '박준혁',
            email: 'pjh_2004@naver.com',
            isMentor: true,
            hopeCategoryId: 3,
            activityCategoryId: 3,
            rank: 10,
            phone: '',
            image:
              'https://menbosha-s3.s3.ap-northeast-2.amazonaws.com/UserImages/24_1704421233846.jpeg',
            intro: {
              shortIntro: null,
              career: '발로란트 최대 티어 불멸',
              customCategory: null,
              detail: null,
              portfolio: null,
              sns: null,
            },
            badge: [
              {
                badgeId: 1,
                createdAt: '2023-12-12T19:59:18.000Z',
              },
              {
                badgeId: 2,
                createdAt: '2023-12-12T19:59:18.000Z',
              },
            ],
          },
        },
      },
    }),
  );
}
