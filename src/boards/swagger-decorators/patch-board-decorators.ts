import { applyDecorators } from '@nestjs/common';
import { ApiHeaders, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiUpdateMentorBoard() {
  return applyDecorators(
    ApiOperation({
      summary: '보드를 수정하는 API',
      description: '보드 수정하는 API',
    }),
    ApiResponse({
      status: 200,
      description: '보드의 내용을 성공적으로 수정한 경우',
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
      description: 'DB에서 사용자를 찾을 수 없는 경우',
      content: {
        JSON: {
          example: { statusCode: 404, message: '사용자를 찾을 수 없습니다.' },
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
      description: '보드 수정중 오류가 발생했습니다',
      content: {
        JSON: {
          example: {
            statusCode: 500,
            message: '보드 수정 중 오류가 발생했습니다.',
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
