import { applyDecorators } from '@nestjs/common';
import { ApiHeaders, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetOneMentorBoard() {
  return applyDecorators(
    ApiOperation({
      summary: '클릭한 멘토 보드 가져오는 API',
      description: 'header - accessToken, param - mentorBoardId ',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 멘토보드를 불러온 경우',
      content: {
        JSON: {
          example: {
            id: '8',
            head: '제목',
            body: '내용',
            createdAt: '2023-12-06T23:51:47.969Z',
            updatedAt: '2023-12-06T23:51:47.969Z',
            categoryId: 4,
            user: {
              name: '홍길동',
              userImage: {
                id: 'image pk키 (number)',
                userId: '유저 아이디 (number)',
                imageUrl: '이미지 url(string)',
              },
            },
            unitowner: 'bollean값',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: '우리 서비스의 액세스 토큰이 아닌 경우',
      content: {
        JSON: {
          example: { statusCode: 401, message: '유효하지 않은 토큰입니다.' },
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: '만료된 액세스 토큰인 경우',
      content: {
        JSON: {
          example: { statusCode: 403, message: '만료된 토큰입니다.' },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'DB에서 일치하는 보드를 찾을 수 없는 경우',
      content: {
        JSON: {
          example: { statusCode: 404, message: '보드를 찾을 수 없습니다.' },
        },
      },
    }),
    ApiResponse({
      status: 411,
      description: '액세스 토큰이 제공되지 않은 경우',
      content: {
        JSON: {
          example: { statusCode: 411, message: '토큰이 제공되지 않았습니다.' },
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
