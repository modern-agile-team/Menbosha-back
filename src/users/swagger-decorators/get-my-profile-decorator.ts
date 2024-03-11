import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

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
            id: 24,
            name: '박준혁',
            email: 'pjh_2004@naver.com',
            isMentor: true,
            hopeCategoryId: 4,
            activityCategoryId: 3,
            rank: 10,
            phone: '',
            image:
              'https://menbosha-s3.s3.ap-northeast-2.amazonaws.com/UserImages/24_1704421233846.jpeg',
            intro: {
              shortIntro: '안녕하세요',
              career: '숨쉬기 경력 20년',
              customCategory: '코로 숨쉬기, 입으로 숨쉬기',
              detail:
                '안녕하세요. 저는 트위치에서 방송을 하고 있는 스트리머 케인입니다.',
              portfolio: 'https://www.naver.com',
              sns: 'https://www.naver.com',
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
        example: '여기에 액세스 토큰',
      },
    ]),
    ApiBearerAuth('access-token'),
  );
}
