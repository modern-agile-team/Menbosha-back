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
            id: 2,
            name: '이재진',
            isMentor: true,
            hopeCategoryId: 1,
            activityCategoryId: 1,
            rank: 10,
            phone: '',
            createdAt: '2024-02-28T05:12:03.000Z',
            updatedAt: '2024-02-29T07:45:16.000Z',
            userImage: {
              imageUrl:
                'https://phinf.pstatic.net/contact/20230313_71/1678704142906wkazc_JPEG/E2B77116-D2F9-4CCC-A177-A357FF611682.jpg',
            },
            userIntro: {
              shortIntro: '나를 간단하게 소개해봐요.',
              career: '나를 어필할만한 경력을 작성해주세요.',
              customCategory: '나만의 카테고리를 작성해주세요.',
              detail: '내가 어떤 사람인지 자세하게 작성해주세요.',
              portfolio: '나를 소개할 수 있는 링크가 있다면 추가해주세요.',
              sns: 'SNS 계정의 링크를 추가해주세요.',
            },
            userBadge: [
              {
                badgeId: 1,
                createdAt: '2023-12-12T19:59:18.000Z',
              },
              {
                badgeId: 2,
                createdAt: '2023-12-12T19:59:18.000Z',
              },
            ],
            totalCount: {
              mentorBoardCount: 9,
              reviewCount: 8,
            },
          },
        },
      },
    }),
  );
}
