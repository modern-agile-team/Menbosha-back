import { applyDecorators } from '@nestjs/common';
import { ApiParam, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiPostUserRank() {
  return applyDecorators(
    ApiOperation({
      summary: '유저의 기존 랭크를 검사하고, 새로운 랭크 정보를 가져오는 API',
      description: '기존 랭크를 검사하고, 새로운 랭크 정보를 가져오는 API',
    }),

    ApiResponse({
      status: 201,
      description:
        '유저의 기존 랭크를 검사하고, 유저의 랭크 정보를 성공적으로 최신화했을 경우',
      content: {
        JSON: {
          examples: {
            test1: {
              value: {
                data: [
                  {
                    myRank: 155,
                  },
                  {
                    newRank: 155,
                  },
                ],
                statusCode: 201,
                message: '기존의 랭크와 새로운 랭크의 변동이 없는 경우',
              },
              description: '랭크에 변동이 없는 경우',
            },
            test2: {
              value: {
                data: [
                  {
                    myRank: 155,
                  },
                  {
                    newRank: 351,
                  },
                ],
                statusCode: 201,
                message: '기존의 랭크와 새로운 랭크의 변동이 있는 경우',
              },
              description: '랭크의 변동이 있는 경우',
            },
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
    ApiParam({ name: 'userId', example: 4 }),
  );
}
