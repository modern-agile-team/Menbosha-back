import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseUserRankingDto } from '../dtos/response-user-ranking.dto';

export function ApiGetTotalRanking() {
  return applyDecorators(
    ApiOperation({
      summary: '전체 랭킹 조회 API',
      description: '전체 랭킹 조회 API',
    }),
    ApiResponse({
      status: 200,
      description: '전체 랭킹 조회 성공',
      schema: {
        properties: {
          userRanking: {
            type: 'array',
            items: {
              $ref: getSchemaPath(ResponseUserRankingDto),
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: '전체 랭킹 조회 실패',
    }),
    ApiExtraModels(ResponseUserRankingDto),
  );
}
