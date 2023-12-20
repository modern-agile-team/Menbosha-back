import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetPageMentorBoards() {
  return applyDecorators(
    ApiOperation({
      summary: '페이지별 보드 불러오는 API',
      description: '페이지별 보드 불러오는 API',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 보드를 불러왔습니다.',
      content: {
        JSON: {
          example: {
            id: '보드의 id를 받아옵니다.',
            userId: '유저의 id를 받아옵니다.',
            head: '수정한 게시물 제목입니다.',
            body: '수정한 게시물 본문입니다.',
            categoryId: '수정한 카테고리가 Id(number)형태로 받아옵니다..',
            createAt: '2023-10-29T17:07:53.964Z',
            updateAt: '수정한 시간이 됩니다.',
            user: {
              name: '이승우',
              userImage: {
                id: '유저이미지 고유 id가 number로 들어옵니다',
                userId: '유저의 고유 id가 number로 들어옵니다',
                imageUrl:
                  '유저의 고유 프로필 사진 URL이 string으로 들어옵니다.',
              },
            },
            boardImages: [
              {
                id: '고유 보드 이미지 id',
                boardId: '수정한 보드의 id',
                imageUrl: 's3에 저장된 보드 이미지 URL',
              },
              {
                id: '고유 보드 이미지 id',
                boardId: '수정한 보드의 id',
                imageUrl: 's3에 저장된 보드 이미지 URL',
              },
              {
                id: '고유 보드 이미지 id',
                boardId: '수정한 보드의 id',
                imageUrl: 's3에 저장된 보드 이미지 URL',
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
  );
}
