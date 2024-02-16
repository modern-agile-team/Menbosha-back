import { applyDecorators } from '@nestjs/common';
import { ApiParam, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiPostUserBadges() {
  return applyDecorators(
    ApiOperation({
      summary: '유저의 획득한 뱃지를 검사하고  정보를 가져오는 API',
      description: '획득한 뱃지 검사하고, 유저의 뱃지 정보를 가져오는 API',
    }),
    ApiResponse({
      status: 201,
      description: '새로운 뱃지가 추가되고, 기존의 뱃지도 남아있는 경우',
      content: {
        JSON: {
          example: {
            data: [
              [
                {
                  id: 'number',
                  userId: 'number',
                  badgeId: 'number',
                  createdAt: '2024-02-14T21:58:03.000Z',
                },
                {
                  id: 'number',
                  userId: 'number',
                  badgeId: 'number',
                  createdAt: '2024-02-14T21:58:03.000Z',
                },
              ],
              {
                acquiredBadges: [
                  {
                    userId: 'number',
                    badgeId: 'number',
                    id: 'number',
                    createdAt: '2024-02-14T21:59:28.000Z',
                  },
                  {
                    userId: 'number',
                    badgeId: 'number',
                    id: 'number',
                    createdAt: '2024-02-14T21:59:28.000Z',
                  },
                ],
              },
            ],
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: '새로운 뱃지는 없고, 기존의 뱃지만 불러올 경우',
      content: {
        JSON: {
          example: {
            data: [
              [
                {
                  id: 'number',
                  userId: 'number',
                  badgeId: 'number',
                  createdAt: '2024-02-14T21:58:03.000Z',
                },
                {
                  id: 'number',
                  userId: 'number',
                  badgeId: 'number',
                  createdAt: '2024-02-14T21:58:03.000Z',
                },
              ],
              {
                acquiredBadges: [],
              },
            ],
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: '기존의 뱃지는 없고, 새로운 뱃지만 추가 될 경우',
      content: {
        JSON: {
          example: {
            data: [
              [],
              {
                acquiredBadges: [
                  {
                    id: 'number',
                    userId: 'number',
                    badgeId: 'number',
                    createdAt: '2024-02-14T21:58:03.000Z',
                  },
                  {
                    id: 'number',
                    userId: 'number',
                    badgeId: 'number',
                    createdAt: '2024-02-14T21:58:03.000Z',
                  },
                ],
              },
            ],
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: '서버 에러',
      content: {
        JSON: {
          example: {
            statusCode: 500,
            message: 'DB혹은 서버쪽 에러입니다.',
          },
        },
      },
    }),
    ApiParam({ name: 'userId', example: 30 }),
  );
}
