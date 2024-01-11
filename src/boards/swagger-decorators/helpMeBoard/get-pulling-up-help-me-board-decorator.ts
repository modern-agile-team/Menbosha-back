import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetPullingUpHelpMeBoard() {
  return applyDecorators(
    ApiOperation({
      summary: '끌어올려진 도와주세요 게시글만 불러오는 API',
      description: '끌어올려진 도와주세요 게시글만 불러오는 API',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 도와주세요 게시글을 불러온 경우',
      content: {
        JSON: {
          example: {
            id: 'number',
            head: '제목',
            body: '내용',
            pullingUp: 'Date',
            categoryId: 'number',
            user: {
              name: '홍길동',
              userImage: {
                id: 'image pk키 (number)',
                userId: '유저 아이디 (number)',
                imageUrl: '이미지 url(string)',
              },
            },
            helpMeBoardImages: [
              {
                id: 'number',
                imageUrl: 's3 저장된 url 주소',
              },
              {
                id: 'number',
                imageUrl: 's3 저장된 url 주소',
              },
            ],
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 멘티보드를 불러온 경우',
      content: {
        JSON: { example: { message: '멘티보드를 성공적으로 불러왔습니다.' } },
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
      status: 404,
      description: '사용자가 작성한 게시물이 아닐 경우',
      content: {
        JSON: {
          example: {
            statusCode: 404,
            message: '사용자가 작성한 게시물이 아닙니다.',
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
  );
}
