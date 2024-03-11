import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetMyRank() {
  return applyDecorators(
    ApiOperation({
      summary: '내 온도/칭호 조회 API',
      description: '내 온도/칭호 조회 API',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 내 온도/칭호를 조회한 경우',
      content: {
        JSON: {
          example: {
            rank: 10,
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
    ApiBearerAuth('access-token'),
  );
}
