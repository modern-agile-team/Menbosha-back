import { applyDecorators } from '@nestjs/common';
import { ApiParam, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

export function ApiGetMentorList() {
  return applyDecorators(
    ApiOperation({
      summary: '멘토의 리스트를 가져오는 API',
      description: 'isMentor = true 일 경우, intro는 default로 작성되야함',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 멘토의 리스트를 가져왔을 경우',
      content: {
        JSON: {
          example: {
            data: [
              {
                id: 'number',
                name: '이승우',
                userImage: {
                  id: 'number',
                  userId: 'number',
                  imageUrl: 'string',
                },
                userIntro: {
                  introduce: 'substring(0, 30)',
                  mainField: 'substring(0, 30)',
                },
                countReview: 'number',
                countBoard: 'number',
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
    ApiParam({ name: 'page', example: 1 }),
    ApiQuery({ name: 'categoryId', type: Number }),
  );
}
