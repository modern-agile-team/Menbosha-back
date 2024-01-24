import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

export function ApiGetRandomMentorBoards() {
  return applyDecorators(
    ApiOperation({
      summary: '랜덤한 멘토 보드 가져오는 API',
      description: '랜덤한 멘토 보드 3개 가져오는 API ',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 랜덤한 멘토보드를 불러온 경우',
      content: {
        JSON: {
          example: {
            data: [
              {
                id: 'number',
                head: 'string',
                body: 'string',
                createdAt: '2023-12-10T20:14:13.311Z',
                updatedAt: '2023-12-10T20:14:13.311Z',
                categoryId: 'number',
                user: {
                  name: '이승우',
                  userImage: {
                    id: 'number',
                    userId: 'number',
                    imageUrl: 'string ',
                  },
                },
                mentorBoardImage: ['있을 경우 배열, 없을 경우 빈 배열'],
                mentorBoardLikes: 'number',
              },
              {
                id: 23,
                head: 'string',
                body: 'string',
                createdAt: '2023-12-22T05:09:12.142Z',
                updatedAt: '2023-12-22T05:09:12.142Z',
                categoryId: 'number',
                user: {
                  name: '이승우',
                  userImage: {
                    id: 'number',
                    userId: 'number',
                    imageUrl: 'string',
                  },
                },
                mentorBoardImage: ['있을 경우 배열, 없을 경우 빈 배열'],
                mentorBoardLikes: 'number',
              },
              {
                id: 20,
                head: '게시물 제목',
                body: 'click send to get a response b',
                createdAt: '2023-12-19T20:55:53.285Z',
                updatedAt: '2023-12-19T20:55:53.285Z',
                categoryId: 'number',
                user: {
                  name: '이승우',
                  userImage: {
                    id: 14,
                    userId: 'number',
                    imageUrl: 'string',
                  },
                },
                mentorBoardImage: ['있을 경우 배열, 없을 경우 빈 배열'],
                mentorBoardLikes: 'number',
              },
            ],
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: '보드를 불러오는 중 오류가 발생한 경우',
      content: {
        JSON: {
          example: {
            statusCode: 500,
            message: '보드를 불러오는 중 오류가 발생했습니다.',
          },
        },
      },
    }),
    ApiQuery({ name: 'categoryId', type: Number }),
  );
}
